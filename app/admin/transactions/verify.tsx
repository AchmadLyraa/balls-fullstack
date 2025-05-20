"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { confirmPayment } from "@/app/actions/admin";

interface VerifyProps {
  transactionId: string;
}

export default function Verify({ transactionId }: VerifyProps) {
  const [note, setNote] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set("paymentId", transactionId);
      formData.set("note", note);

      const result = await confirmPayment(formData);

      if (result.success) {
        toast.success("Payment verified successfully!");
      } else {
        toast.error(result.error || "Failed to verify payment");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Check className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Verification</DialogTitle>
          <DialogDescription>Payment ID: {transactionId}</DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="Payment note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
          className="my-4"
        />
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button disabled={isLoading} onClick={handleVerify}>
            {isLoading ? "Veryfing" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
