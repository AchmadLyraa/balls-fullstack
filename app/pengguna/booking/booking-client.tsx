"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserJwtPayload } from "@/lib/server-auth";
import { toast } from "sonner";
import { createBooking } from "@/app/actions/booking";

interface BookingClientProps {
  user: UserJwtPayload;
}

export default function BookingClient({ user }: BookingClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(
    null,
  );
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fields = [
    { id: "field-a", name: "Field A (North Wing)" },
    { id: "field-b", name: "Field B (South Wing)" },
  ];

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
      formData.append("fieldId", selectedField);
      formData.append("date", selectedDate.toISOString().split("T")[0]);
      formData.append("startTime", selectedStartTime);
      formData.append("endTime", selectedEndTime);

      const result = await createBooking(formData);

      if (result.success) {
        toast.success("Booking confirmed! Redirecting to payment...");

        // Simulate a delay before redirecting
        setTimeout(() => {
          router.push(
            `/pengguna/booking/upload-payment?bookingId=${result.bookingId}`,
          );
        }, 1500);
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
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Borneo Anfield Stadium</h1>
              <p className="text-gray-500">Book your field now</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex space-x-4">
              <div
                className={`flex-1 border-b-2 pb-4 ${step >= 1 ? "border-red-600 text-red-600" : "border-gray-200"}`}
              >
                <div className="flex items-center">
                  <div
                    className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-red-600 text-white" : "bg-gray-200"}`}
                  >
                    1
                  </div>
                  <span>Select Field & Time</span>
                </div>
              </div>
              <div
                className={`flex-1 border-b-2 pb-4 ${step >= 2 ? "border-red-600 text-red-600" : "border-gray-200"}`}
              >
                <div className="flex items-center">
                  <div
                    className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-red-600 text-white" : "bg-gray-200"}`}
                  >
                    2
                  </div>
                  <span>Confirm Details</span>
                </div>
              </div>
              <div
                className={`flex-1 border-b-2 pb-4 ${step >= 3 ? "border-red-600 text-red-600" : "border-gray-200"}`}
              >
                <div className="flex items-center">
                  <div
                    className={`mr-2 flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? "bg-red-600 text-white" : "bg-gray-200"}`}
                  >
                    3
                  </div>
                  <span>Payment</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium">
                  Select Field:
                </label>
                <Select
                  value={selectedField || ""}
                  onValueChange={setSelectedField}
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

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium">
                  Select Start Time:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {startTimeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={
                        selectedStartTime === time ? "default" : "outline"
                      }
                      onClick={() => {
                        setSelectedStartTime(time);
                        // Auto-select end time 2 hours later if not selected
                        if (!selectedEndTime) {
                          const index = startTimeSlots.indexOf(time);
                          if (index >= 0 && index < startTimeSlots.length - 1) {
                            setSelectedEndTime(endTimeSlots[index + 1]);
                          }
                        }
                      }}
                      className={
                        selectedStartTime === time
                          ? "bg-red-600 hover:bg-red-700"
                          : ""
                      }
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium">
                  Select End Time:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {endTimeSlots.map((time) => {
                    // Disable end times that are before or equal to start time
                    const isDisabled = selectedStartTime
                      ? time <= selectedStartTime
                      : false;

                    return (
                      <Button
                        key={time}
                        variant={
                          selectedEndTime === time ? "default" : "outline"
                        }
                        onClick={() => setSelectedEndTime(time)}
                        disabled={isDisabled}
                        className={
                          selectedEndTime === time
                            ? "bg-red-600 hover:bg-red-700"
                            : ""
                        }
                      >
                        {time}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Select Date
              </label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border p-2"
                disabled={(date) => date < new Date()}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleConfirmBooking}
              disabled={
                !selectedField ||
                !selectedDate ||
                !selectedStartTime ||
                !selectedEndTime ||
                isLoading
              }
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Processing..." : "Confirm Booking"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
