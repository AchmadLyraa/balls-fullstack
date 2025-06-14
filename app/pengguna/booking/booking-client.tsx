//app/pengguna/booking/booking-client.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createBooking } from "@/app/actions/booking";
import type { Prisma } from "@prisma/client";
import TimeSelector from "./time-selector";

export interface BookingClientProps {
  fields: Prisma.FieldGetPayload<{
    omit: {
      createdAt: true;
      updatedAt: true;
      isAvailable: true;
      hourlyRate: true;
    };
    include: {
      bookings: {
        select: {
          bookingDate: true;
          startTime: true;
          endTime: true;
        };
      };
    };
  }>[];
}

export default function BookingClient({ fields }: BookingClientProps) {
  const router = useRouter();
  const [selectedField, setSelectedField] = useState<
    BookingClientProps["fields"][number] | null
  >(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(
    null,
  );
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [handlerDisabled, setHandlerDisabled] = useState(false);

  const startTimeSlots = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];
  const endTimeSlots = ["11:00", "13:00", "15:00", "17:00", "19:00", "21:00"];

  const handleConfirmBooking = async () => {
    if (
      !selectedField ||
      !selectedDate ||
      !selectedStartTime ||
      !selectedEndTime
    ) {
      toast.error("Please select all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fieldId", selectedField.id);
      formData.append(
        "date",
        new Date(
          selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000,
        )
          .toISOString()
          .split("T")[0],
      );
      formData.append("startTime", selectedStartTime);
      formData.append("endTime", selectedEndTime);

      const result = await createBooking(formData);

      if (result.success) {
        setHandlerDisabled(true);

        toast.success("Booking confirmed! Redirecting to payment...");

        router.push(
          `/pengguna/booking/upload-payment?bookingId=${result.bookingId}`,
        );
      } else {
        toast.error(result.error || "Failed to create booking");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="grid gap-6 rounded-md border border-input bg-gray-50/50 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Select Field:
            </label>
            <Select
              value={selectedField?.id ?? ""}
              onValueChange={(fieldId) => {
                const field = fields.find((field) => field.id === fieldId);

                if (field) {
                  setSelectedField(field);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Select Date
            </label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedStartTime(null);
                setSelectedEndTime(null);
              }}
              className="rounded-md border p-2"
              disabled={(date) => date < new Date()}
            />
          </div>
        </div>

        {selectedField && selectedDate && (
          <TimeSelector
            selectedField={selectedField}
            selectedDate={selectedDate}
            startTimeSlots={startTimeSlots}
            endTimeSlots={endTimeSlots}
            selectedStartTime={selectedStartTime}
            selectedEndTime={selectedEndTime}
            setSelectedStartTime={setSelectedStartTime}
            setSelectedEndTime={setSelectedEndTime}
          />
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleConfirmBooking}
          disabled={
            !selectedField ||
            !selectedDate ||
            !selectedStartTime ||
            !selectedEndTime ||
            isLoading ||
            handlerDisabled
          }
          className="bg-red-600 hover:bg-red-700"
        >
          {isLoading ? "Processing..." : "Confirm Booking"}
        </Button>
      </div>
    </>
  );
}
