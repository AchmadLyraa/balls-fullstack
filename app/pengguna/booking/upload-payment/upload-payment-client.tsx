"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserJwtPayload } from "@/lib/server-auth";
import { toast } from "sonner";
import { type Booking, uploadPaymentProof } from "@/app/actions/booking";
import { formatMoney, snakeCaseToTitleCase } from "@/lib/utils";
import ImageDragAndDrop from "@/components/ui/image-drag-and-drop";
import { PaymentMethod } from "@prisma/client";

interface UploadPaymentClientProps {
  user: UserJwtPayload;
  booking: Booking;
}

export default function UploadPaymentClient({
  user,
  booking,
}: UploadPaymentClientProps) {
  const router = useRouter();

  const [file, setFile] = useState<File | null | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("bookingId", booking.id);
      formData.append("paymentMethod", paymentMethod);
      formData.append("proofImage", file);

      const result = await uploadPaymentProof(formData);

      if (result.success) {
        toast.success("Payment proof uploaded successfully!");
        router.push(`/pengguna/booking/player?bookingId=${booking.id}`);
      } else {
        toast.error(result.error || "Failed to upload payment proof");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {booking.payments[0]?.status === "INVALID" && (
        <div className="mb-6 rounded-md border border-red-600 bg-red-100 p-3 pt-2">
          <p>
            Your previous payment is considered{" "}
            <span className="font-bold text-red-800">invalid</span> because:{" "}
            {booking.payments[0].notes}
          </p>

          <img src={`/user-content/booking/payment/${booking.id}.webp`} />
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(PaymentMethod).map((method) => (
                <SelectItem value={method}>
                  {snakeCaseToTitleCase(method.toLowerCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" value={formatMoney(booking.amount)} disabled />
        </div>
      </div>

      <ImageDragAndDrop file={file} setFile={setFile} />

      <div
        title={
          file
            ? paymentMethod
              ? undefined
              : "Please select payment method"
            : undefined
        }
        className="mt-6 flex justify-center"
      >
        {!file ? (
          <label htmlFor="file-upload">
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <span>Browse</span>
            </Button>
          </label>
        ) : (
          <Button
            onClick={handleUpload}
            disabled={isUploading || !paymentMethod}
            className="bg-red-600 hover:bg-red-700"
          >
            {isUploading ? "Uploading..." : "Upload Proof of Payment"}
          </Button>
        )}
      </div>
    </>
  );
}
