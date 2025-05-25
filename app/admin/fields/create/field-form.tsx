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
import { createAdmin, createField } from "@/app/actions/admin";
import { fieldSchema } from "../schema";
import { useRouter } from "next/navigation";

type Form = z.infer<typeof fieldSchema>;

export default function AdminForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Form>({
    resolver: zodResolver(fieldSchema),
  });

  const onSubmit = async (data: Form) => {
    setIsLoading(true);

    try {
      const result = await createField(data);

      if (result.success) {
        toast.success("Field has been added");
        router.push("/admin/fields");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error(`Failed to add new field. Please try again later`);
    } finally {
      setIsLoading(false);
    }
  };

  const createInput = <TName extends keyof Form>(
    name: string,
    type?: "number",
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
          name="name"
          render={createInput("Name")}
        />

        <FormField
          control={form.control}
          name="description"
          render={createInput("Description")}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={createInput("Capacity", "number")}
        />

        <FormField
          control={form.control}
          name="hourlyRate"
          render={createInput("Hourly rate")}
        />

        <Button type="submit" className="w-full">
          {isLoading ? "Adding" : "Add"} Field
        </Button>
      </form>
    </Form>
  );
}
