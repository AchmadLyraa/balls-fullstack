import { z } from "zod";
import { editAdminSchema } from "../edit-admin/[id]/schema";

export const addAdminSchema = editAdminSchema
  .extend({
    password: z.string().min(6),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
