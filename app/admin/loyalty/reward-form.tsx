"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";
import { CalendarIcon } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editLoyaltyProgram } from "@/app/actions/loyalty";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDateDMY } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { loyaltyFormSchema } from "./schema";
import ImageDragAndDrop from "@/components/ui/image-drag-and-drop";

type Form = z.infer<typeof loyaltyFormSchema>;

type FilterKeys<T> = {
  [K in keyof T]: NonNullable<T[K]> extends string | number ? K : never;
}[keyof T];

type RewardFormProps =
  | {
      programId: string;
      defaultValues: Form;
      setIsOpen: Dispatch<SetStateAction<boolean>>;
    }
  | {
      programId?: undefined;
      defaultValues?: undefined;
      setIsOpen: Dispatch<SetStateAction<boolean>>;
    };

export default function RewardForm({
  programId,
  defaultValues,
  setIsOpen,
}: RewardFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [file, setFile] = useState<File | undefined>();

  const form = useForm<Form>({
    resolver: zodResolver(loyaltyFormSchema),
    defaultValues: defaultValues ?? { isActive: true },
  });

  const onSubmit = async (data: Form) => {
    setIsLoading(true);

    try {
      if (programId) {
        const result = await editLoyaltyProgram(programId, data, file);

        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.error);
        }
      } else {
      }
    } catch {
      toast.error(
        `Failed to ${programId ? "edit" : "create"} loyalty program. Please try again later`,
      );
    } finally {
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  const createInput = <TName extends FilterKeys<Form>>(
    name: string,
    type?: "number",
    className?: string,
  ) => {
    return ({ field }: { field: ControllerRenderProps<Form, TName> }) => (
      <FormItem className={className}>
        <FormLabel>{name}</FormLabel>
        <FormControl>
          <Input type={type} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-8">
        <FormField
          control={form.control}
          name="programName"
          render={createInput("Name")}
        />

        <FormField
          control={form.control}
          name="description"
          render={createInput("Description")}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <div>
                  <FormLabel>Effective from</FormLabel>
                </div>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon />
                        {field.value ? (
                          formatDateDMY(field.value)
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      withoutPortal
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <div>
                  <FormLabel>Valid until</FormLabel>
                </div>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon />
                        {field.value ? (
                          formatDateDMY(field.value)
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      withoutPortal
                      className="w-auto p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < (form.getValues().startDate || new Date())
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="pointsRequired"
            render={createInput("Required points", "number", "flex-1")}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <div>
                  <FormLabel>Active</FormLabel>
                </div>
                <FormControl className="ml-auto">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="translate-x-[-75%] translate-y-[75%] scale-[2.5]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormItem>
          <div>
            <FormLabel>Thumbnail</FormLabel>
          </div>
          <FormControl>
            <ImageDragAndDrop file={file} setFile={setFile} />
          </FormControl>
          <FormMessage />
        </FormItem>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isLoading}>
            {defaultValues ? "Edit" : "Create"}
            {isLoading ? "ing" : ""}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
