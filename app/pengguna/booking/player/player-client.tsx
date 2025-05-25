"use client";

import type React from "react";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DynamicInputList, {
  type DynamicInputListRef,
} from "./dynamic-input-list";
import { setPlayersToBooking, type Booking } from "@/app/actions/booking";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PlayerClientProps {
  userFullname: string;
  username: string;
  booking: Booking;
}

export default function PlayerClient({
  userFullname,
  username,
  booking,
}: PlayerClientProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const playerListRef = useRef<DynamicInputListRef>(null);
  const usernameListRef = useRef<DynamicInputListRef>(null);

  const handleSubmit = async () => {
    const playerList = playerListRef.current?.getValues();
    if (!playerList) {
      toast.error("Invalid player list");

      return;
    } else if (playerList.length === 0) {
      return;
    }

    const usernameList = usernameListRef.current?.getValues();
    if (!usernameList) {
      toast.error("Invalid player list");

      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("bookingId", booking.id);
      formData.append("players", JSON.stringify(playerList));
      formData.append("usernames", JSON.stringify(usernameList));

      const result = await setPlayersToBooking(formData);

      if (result.success) {
        toast.success("Player list added successfully!");
        router.push(`/pengguna/booking/success?bookingId=${booking.id}`);
      } else {
        toast.error(result.error || "Failed to add player list");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <DynamicInputList
          ref={playerListRef}
          placeholder="Player"
          initialValue={userFullname}
          maxValues={booking.field.capacity}
        >
          <p className="text-sm font-medium leading-none">
            Player's full name list
          </p>
        </DynamicInputList>

        <DynamicInputList
          ref={usernameListRef}
          placeholder="Account Username"
          initialValue={username}
          initialValueDisabled
        >
          <p className="text-sm font-medium leading-none">
            List of usernames that will get royalty points
          </p>
        </DynamicInputList>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-red-600 hover:bg-red-700"
        >
          {isLoading ? "Processing..." : "Set Players"}
        </Button>
      </div>
    </>
  );
}
