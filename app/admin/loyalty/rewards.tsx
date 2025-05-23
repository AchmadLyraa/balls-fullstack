"use client";

import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { getRewards } from "./page";
import RewardForm from "./reward-form";
import DeleteConfirmation from "./delete-confirmation";

interface RewardsProps {
  rewards: Awaited<ReturnType<typeof getRewards>>;
}

export default function Rewards({ rewards }: RewardsProps) {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selected, setSelected] = useState<
    (typeof rewards)[number] | undefined
  >();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<ReactNode>();
  const [shake, setShake] = useState(false);

  return (
    <TabsContent value="rewards" className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward) => (
          <Card key={reward.id}>
            <img
              src={`/content/loyalty/${reward.id}.webp?t=${reward.updatedAt.getTime()}`}
              className="h-40 w-full rounded-t-md bg-gray-200"
            />
            <CardContent className="flex flex-col items-center p-6">
              <h3 className="font-medium">{reward.programName}</h3>
              <p className="text-sm text-gray-500">
                {reward.pointsRequired} Points
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDialogContent(
                      <>
                        <DialogHeader>
                          <DialogTitle>Edit {reward.programName}</DialogTitle>
                        </DialogHeader>
                        <RewardForm
                          programId={reward.id}
                          defaultValues={reward}
                          setIsOpen={setIsFormOpen}
                        />
                      </>,
                    );
                    setIsFormOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelected(reward);
                    setIsConfirmationOpen(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="flex h-full flex-col items-center justify-center p-6">
            <Button
              variant="outline"
              className="h-16 w-16 rounded-full"
              onClick={() => {
                setDialogContent(
                  <>
                    <DialogHeader aria-describedby={undefined}>
                      <DialogTitle>Add New Reward</DialogTitle>
                    </DialogHeader>
                    <RewardForm setIsOpen={setIsFormOpen} />
                  </>,
                );
                setIsFormOpen(true);
              }}
            >
              <Plus className="h-8 w-8" />
            </Button>
            <p className="mt-4 font-medium">Add New Reward</p>
          </CardContent>
        </Card>

        {selected && (
          <DeleteConfirmation
            isOpen={isConfirmationOpen}
            setIsOpen={setIsConfirmationOpen}
            program={selected}
          />
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent
            onInteractOutside={(e) => {
              e.preventDefault();
              setShake(true);
              setTimeout(() => {
                setShake(false);
              }, 300);
            }}
            className="max-h-[calc(100vh-6rem)] overflow-y-scroll"
          >
            <div
              className={
                "transition-transform" + (shake ? " animate-shake" : "")
              }
            >
              {dialogContent}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TabsContent>
  );
}
