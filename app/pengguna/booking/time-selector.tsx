import { Dispatch, SetStateAction, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { BookingClientProps } from "./booking-client";

interface TimeSelectorProps {
  selectedField: BookingClientProps["fields"][number];
  selectedDate: Date;
  startTimeSlots: string[];
  endTimeSlots: string[];
  selectedStartTime: string | null;
  selectedEndTime: string | null;
  setSelectedStartTime: Dispatch<SetStateAction<string | null>>;
  setSelectedEndTime: Dispatch<SetStateAction<string | null>>;
}

export default function TimeSelector({
  selectedField,
  selectedDate,
  startTimeSlots,
  endTimeSlots,
  selectedStartTime,
  selectedEndTime,
  setSelectedStartTime,
  setSelectedEndTime,
}: TimeSelectorProps) {
  const convertTimeSlotIntoMinutes = (timeSlot: string) => {
    const [hour, minute] = timeSlot.split(":") as [string, string];

    return Number(hour) * 60 + Number(minute);
  };

  const [startTimes, endTimes] = useMemo(() => {
    const convertDateIntoMinutes = (date: Date) => {
      return date.getHours() * 60 + date.getMinutes();
    };

    const startTimes = new Map<string, number>();
    const endTimes = new Map<string, number>();

    startTimeSlots.forEach((timeSlot) => {
      startTimes.set(timeSlot, convertTimeSlotIntoMinutes(timeSlot));
    });
    endTimeSlots.forEach((timeSlot) => {
      endTimes.set(timeSlot, convertTimeSlotIntoMinutes(timeSlot));
    });

    selectedField.bookings.forEach((booking) => {
      const { bookingDate } = booking;
      if (
        bookingDate.getUTCMonth() !== selectedDate.getUTCMonth() ||
        bookingDate.getUTCDate() !== selectedDate.getUTCDate()
      ) {
        return;
      }

      const startMinutes = convertDateIntoMinutes(booking.startTime);
      const endMinutes = convertDateIntoMinutes(booking.endTime);

      let i = 0;
      endTimes.forEach((minutes, timeSlot) => {
        i++;

        if (startMinutes <= minutes && minutes < endMinutes) {
          endTimes.set(timeSlot, -1);
        } else if (minutes === endMinutes) {
          endTimes.set(timeSlot, -1);
          endTimes.set(endTimeSlots[i], -1);
        }
      });

      i = 0;
      startTimes.forEach((minutes, timeSlot) => {
        i++;

        if (startMinutes <= minutes && minutes < endMinutes) {
          startTimes.set(timeSlot, -1);
        } else if (minutes === endMinutes) {
          startTimes.set(timeSlot, -1);

          if (startTimeSlots[i + 1]) {
            startTimes.set(startTimeSlots[i + 1], -1);
          }
        }
      });
    });

    return [startTimes, endTimes];
  }, [startTimeSlots, endTimeSlots, selectedField.bookings]);

  return (
    <div className="grid gap-6 rounded-md border border-input bg-gray-50/50 p-6">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Select Start Time:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {startTimes.entries().map(([time, minutes]) => (
            <Button
              key={time}
              variant={selectedStartTime === time ? "default" : "outline"}
              disabled={minutes < 0}
              onClick={() => {
                setSelectedStartTime(time);

                const index = startTimeSlots.indexOf(time);
                setSelectedEndTime(endTimeSlots[index]);
              }}
              className={
                selectedStartTime === time ? "bg-red-600 hover:bg-red-700" : ""
              }
            >
              {time}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Select End Time:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {endTimes.entries().map(([time, minutes]) => (
            <Button
              key={time}
              variant={selectedEndTime === time ? "default" : "outline"}
              onClick={() => setSelectedEndTime(time)}
              disabled={
                minutes < 0 ||
                (selectedStartTime ? time <= selectedStartTime : false)
              }
              className={
                selectedEndTime === time ? "bg-red-600 hover:bg-red-700" : ""
              }
            >
              {time}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
