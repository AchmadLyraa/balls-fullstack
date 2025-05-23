"use client";

import { deleteLoyaltyProgram } from "@/app/actions/loyalty";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoyaltyProgram } from "@prisma/client";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

interface DeleteConfirmationProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  program: LoyaltyProgram;
}

export default function DeleteConfirmation({
  isOpen,
  setIsOpen,
  program,
}: DeleteConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const result = await deleteLoyaltyProgram(program.id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to delete loyalty program. Please try again later");
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to to delete "{program.programName}"
          </DialogTitle>
          <DialogDescription>
            Unredeemed redemptions will continue
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={handleDelete}
          >
            {isLoading ? "Deleting" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
