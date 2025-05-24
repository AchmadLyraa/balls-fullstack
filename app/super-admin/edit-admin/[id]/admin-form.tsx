"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useState } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createAdmin, updateAdmin } from "@/app/actions/admin";
import { editAdminSchema } from "./schema";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";

type Form = z.infer<typeof editAdminSchema>;

interface AdminFormProps {
  adminId: string;
  admin: Pick<User, "username" | "fullName" | "email" | "phoneNumber">;
}

export default function AdminForm({ adminId, admin }: AdminFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Form>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: admin,
  });

  const onSubmit = async (data: Form) => {
    setIsLoading(true);

    try {
      const result = await updateAdmin(adminId, data);

      if (result.success) {
        toast.success("Admin has been added");
        router.push("/super-admin");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error(`Failed to add new admin. Please try again later`);
    } finally {
      setIsLoading(false);
    }
  };

  const createInput = <TName extends keyof Form>(
    name: string,
    type?: "email" | "password",
    className?: string,
  ) => {
    return ({ field }: { field: ControllerRenderProps<Form, TName> }) => {
      const { value, ...rest } = field;

      return (
        <FormItem className={className}>
          <FormLabel>{name}</FormLabel>
          <FormControl>
            <Input type={type} value={value || ""} {...rest} />
          </FormControl>
          <FormMessage />
        </FormItem>
      );
    };
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={createInput("Username")}
        />

        <FormField
          control={form.control}
          name="fullName"
          render={createInput("Fullname")}
        />

        <FormField
          control={form.control}
          name="email"
          render={createInput("Email", "email")}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={createInput("Phone number")}
        />

        <Button type="submit" className="w-full">
          {isLoading ? "Editing" : "Edit"} Admin
        </Button>
      </form>
    </Form>
  );
}
