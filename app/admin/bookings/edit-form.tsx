import { useState, type Dispatch, type SetStateAction } from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookingsClientProps } from "./bookings-client";
import { cancelBooking, completeBooking } from "@/app/actions/booking";
import { toast } from "sonner";

interface EditFormProps {
  selected: BookingsClientProps["bookings"][number];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditForm({
  selected,
  isOpen,
  setIsOpen,
}: EditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<
    "COMPLETED" | "CANCELED" | (string & {})
  >("");

  const handleUpdate = async () => {
    setIsLoading(true);

    try {
      const result =
        status === "COMPLETED"
          ? await completeBooking(selected.id)
          : status === "CANCELED"
            ? await cancelBooking(selected.id)
            : (() => {
                throw new Error();
              })();

      if (result.success) {
        toast.success(`Booking marked as ${status.toLowerCase()}`);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to delete loyalty program. Please try again later");
    } finally {
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Booking Status</DialogTitle>
          <DialogDescription>
            Booking ID: {selected.id}
            <br />
            Reservation Name: {selected.user.fullName}
          </DialogDescription>
        </DialogHeader>

        <Select onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="New status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELED">Canceled</SelectItem>
          </SelectContent>
        </Select>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>

          <Button disabled={isLoading} onClick={handleUpdate}>
            {isLoading ? "Updating" : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
