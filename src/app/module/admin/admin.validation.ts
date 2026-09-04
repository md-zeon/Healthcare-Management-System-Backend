import z from "zod";

const updateAdminZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.email().optional(),
    password: z.string().optional(),
  }),
});

export const AdminValidation = {
  updateAdminZodSchema,
};
