"use client";

import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, formatNumber } from "@/lib/utils";
import type { getRedemptions } from "./page";
import { changeRedemptionStatus } from "@/app/actions/loyalty";
import { toast } from "sonner";

interface RedemptionsProps {
  redemptions: Awaited<ReturnType<typeof getRedemptions>>;
}

export default function Redemptions({ redemptions }: RedemptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<
    (typeof redemptions)[number] | undefined
  >();
  const [newStatus, setNewStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const changeStatus = async () => {
    if (!selected || newStatus === "") {
      return;
    }

    setIsLoading(true);

    try {
      const result = await changeRedemptionStatus(selected.id, newStatus);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error(`Failed to change redemption status. Please try again later`);
    } finally {
      setIsOpen(false);
      setNewStatus("");
    }
  };

  return (
    <TabsContent value="redemptions" className="space-y-4">
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Produk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Stampel yang ditukarkan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {redemptions.map((redemption) => (
              <tr key={redemption.id}>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {redemption.loyaltyProgram.programName}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {redemption.user.fullName}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {formatDate(redemption.redemptionDate)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {formatNumber(redemption.pointsUsed)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={
                      "inline-flex rounded-full border px-2 py-1 text-xs font-semibold leading-5" +
                      (redemption.status === "PENDING"
                        ? "border-yellow-400 bg-yellow-100 text-yellow-600"
                        : redemption.status === "COMPLETED"
                          ? "border-green-400 bg-green-100 text-green-600"
                          : "border-red-400 bg-red-100 text-red-600")
                    }
                  >
                    {redemption.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={
                      redemption.status === "PENDING"
                        ? () => {
                            setIsOpen(true);
                            setSelected(redemption);
                          }
                        : undefined
                    }
                    className={
                      redemption.status !== "PENDING"
                        ? "!opacity-25"
                        : undefined
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Redemption Status</DialogTitle>
              <DialogDescription>
                Redemption ID: {selected.id}
                <br />
                Redemption Reward: {selected.loyaltyProgram.programName}
              </DialogDescription>
            </DialogHeader>

            <Select onValueChange={setNewStatus}>
              <SelectTrigger className="my-2 max-w-[11rem]">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button disabled={isLoading} onClick={changeStatus}>
                {isLoading ? "Changing" : "Change"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </TabsContent>
  );
}
