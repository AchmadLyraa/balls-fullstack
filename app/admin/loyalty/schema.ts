import z from "zod";

export const getLoyaltyFormSchema = (isEdit: boolean) => {
  const thumbnail = z
    .instanceof(File)
    .refine((file) => file.type.startsWith("image/"), {
      message: "Invalid image file type",
    })
    .refine((file) => file.size <= 1e6, {
      message: "Image size should not exceed 1MB",
    });

  return z.object({
    programName: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    description: z.string().nullish(),
    pointsRequired: z.preprocess((val) => {
      if (typeof val === "string" || typeof val === "number") {
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }
      return undefined;
    }, z.number().min(1).max(1000)),
    isActive: z.boolean(),
    startDate: z.date().min(new Date()).nullish(),
    endDate: z.date().min(new Date()).nullish(),
    thumbnail: isEdit ? thumbnail.nullish() : thumbnail,
  });
};
