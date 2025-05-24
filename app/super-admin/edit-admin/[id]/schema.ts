import { z } from "zod";

export const editAdminSchema = z.object({
  username: z.string().min(3),
  fullName: z.string().min(3),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .transform((val) => val.replace(/[\s-]/g, ""))
    .refine((val) => /^(?:08|\+?62)[0-9]{5,16}$/.test(val), {
      message: "Phone number is invalid",
    })
    .nullish(),
});
