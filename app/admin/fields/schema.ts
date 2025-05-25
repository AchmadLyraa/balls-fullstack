import { z } from "zod";

const numberString = z
  .union([
    z.number().min(1),
    z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: "Not a valid number string",
      })
      .transform((val) => Number(val)),
  ])
  .transform((val) => (typeof val === "string" ? Number(val) : val))
  .refine((val) => val >= 1, { message: "Number must be at least 1" });

export const fieldSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3).nullish(),
  capacity: numberString,
  hourlyRate: numberString,
});
