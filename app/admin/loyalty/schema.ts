import z from "zod";

export const loyaltyFormSchema = z.object({
  programName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string().nullable(),
  pointsRequired: z.preprocess((val) => {
    if (typeof val === "string" || typeof val === "number") {
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }
    return undefined;
  }, z.number().min(1).max(1000)),
  isActive: z.boolean(),
  startDate: z.date().min(new Date()).nullable(),
  endDate: z.date().min(new Date()).nullable(),
});
