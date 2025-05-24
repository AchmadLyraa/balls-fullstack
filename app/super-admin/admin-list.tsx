"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import type { User } from "@prisma/client";
import { toast } from "sonner";
import { deleteAdmin } from "../actions/admin";

interface AdminListProps {
  admins: User[];
}

export default function AdminList({ admins }: AdminListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState<User | undefined>();

  const handleDelete = async () => {
    if (!selected) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await deleteAdmin(selected.id);

      if (result.success) {
        toast.success("Admin deleted successfully");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to delete admin. Please try again later");
    } finally {
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {admins.map((admin) => (
        <Card key={admin.id}>
          <CardHeader>
            <CardTitle>{admin.fullName}</CardTitle>
            <CardDescription>{admin.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/super-admin/edit-admin/${admin.id}`}>Edit</Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setSelected(admin);
                  setIsOpen(true);
                }}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {selected && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Admin</DialogTitle>
              <DialogDescription>
                Are you sure want to delete {selected.fullName}'s account?
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                disabled={isLoading}
                onClick={handleDelete}
              >
                {isLoading ? "Deleting" : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
