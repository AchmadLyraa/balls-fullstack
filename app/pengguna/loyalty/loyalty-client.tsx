"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { redeemLoyaltyProgram } from "@/app/actions/loyalty";
import type { getLoyaltyPrograms, getUserRedemptions } from "./page";

interface LoyaltyClientProps {
  loyaltyPrograms: Awaited<ReturnType<typeof getLoyaltyPrograms>>;
  userPoints: number;
  userRedemptions: Awaited<ReturnType<typeof getUserRedemptions>>;
}

export default function LoyaltyClient({
  loyaltyPrograms,
  userPoints,
  userRedemptions,
}: LoyaltyClientProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogData, setDialogData] = useState<
    | {
        redemptionId: string;
        programId: string;
      }
    | {
        text: string;
        buttonText: string;
        handler(): void;
      }
    | null
  >(null);

  const handleRedeemProgram = async (
    program: (typeof loyaltyPrograms)[number],
  ) => {
    if (!userPoints || userPoints < program.pointsRequired) {
      toast.error("You don't have enough points to redeem this reward");
      return;
    }

    try {
      const result = await redeemLoyaltyProgram(program.id);

      if (result.success) {
        setDialogData(result);
        setShowDialog(true);

        toast.success("Reward redeemed successfully!");
      } else {
        toast.error(result.error || "Failed to redeem reward");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Loyalty Card Digital</h1>
              <p className="text-gray-500">Pilih hadiah dan tukar poin kamu!</p>
            </div>
            <div className="rounded-lg bg-red-600 px-4 py-2 text-white">
              <p className="text-sm">Your Points</p>
              <p className="text-2xl font-bold">{userPoints}</p>
            </div>
          </div>

          <Tabs defaultValue="rewards" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
              <TabsTrigger value="history">Redemption History</TabsTrigger>
            </TabsList>

            <TabsContent value="rewards" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loyaltyPrograms.map((program) => (
                  <Card
                    key={program.id}
                    className="flex flex-col overflow-hidden"
                  >
                    <div className="relative h-40 w-full">
                      <img
                        src={
                          program.imageUrl ||
                          "/placeholder.svg?height=200&width=200"
                        }
                        alt={program.programName}
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute right-2 top-2 rounded-full border border-red-400 bg-red-100 px-2 py-1 text-xs text-red-800">
                        {program.pointsRequired} Points
                      </span>
                    </div>
                    <CardContent className="flex flex-1 flex-col gap-2 p-4">
                      <h3 className="font-medium">{program.programName}</h3>
                      <p className="text-sm text-gray-500">
                        {program.description}
                      </p>
                      <div className="mt-2 flex flex-1 flex-col-reverse">
                        <Button
                          onClick={() => {
                            setDialogData({
                              text: `Are you sure you want to exchange ${program.pointsRequired} points for "${program.programName}"?`,
                              buttonText: "Sure",
                              handler() {
                                handleRedeemProgram(program);
                              },
                            });
                            setShowDialog(true);
                          }}
                          disabled={
                            !userPoints || userPoints < program.pointsRequired
                          }
                          className="w-full bg-red-600 hover:bg-red-700"
                          size="sm"
                        >
                          {!userPoints || userPoints < program.pointsRequired
                            ? "Not Enough Points"
                            : "Redeem"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history">
              {userRedemptions.length > 0 ? (
                <div className="space-y-4">
                  {userRedemptions.map((item) => (
                    <Card
                      key={item.id}
                      onClick={() => {
                        if (item.status === "PENDING") {
                          setDialogData({
                            redemptionId: item.id,
                            programId: item.loyaltyProgramId,
                          });
                          setShowDialog(true);
                        }
                      }}
                      className={
                        item.status === "PENDING" ? "cursor-pointer" : undefined
                      }
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h3 className="font-medium">
                            {item.loyaltyProgram.programName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.pointsUsed} Points
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {new Date(item.redemptionDate).toLocaleDateString()}
                          </p>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              item.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : item.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500">No redemption history yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogData && "text" in dialogData
                ? "Hold on!"
                : "Show this QR Code to the BAS cashier!"}
            </DialogTitle>
            {dialogData && "redemptionId" in dialogData && (
              <DialogDescription>
                Scan this QR code to redeem your reward
              </DialogDescription>
            )}
          </DialogHeader>
          {dialogData &&
            ("text" in dialogData ? (
              <p>{dialogData.text}</p>
            ) : (
              <div className="py-4">
                <p className="mb-2 text-center text-xl font-bold">
                  {
                    loyaltyPrograms.find(
                      (program) => program.id === dialogData.programId,
                    )?.programName
                  }
                </p>

                <div className="flex justify-center">
                  <div className="rounded-lg border bg-white p-4">
                    <QRCode
                      value={dialogData.redemptionId}
                      className="h-48 w-48"
                    />
                  </div>
                </div>
              </div>
            ))}
          <DialogFooter>
            <Button
              onClick={() =>
                dialogData && "handler" in dialogData
                  ? dialogData.handler()
                  : setShowDialog(false)
              }
            >
              {dialogData && "buttonText" in dialogData
                ? dialogData.buttonText
                : "Done"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
