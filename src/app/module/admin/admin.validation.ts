import z from "zod";

const updateAdminZodSchema = z.object({
  name: z.string("Name must be a string").optional(),
  profilePhoto: z.url("Profile photo must be a valid URL").optional(),
  contactNumber: z.string("Contact number must be a string").optional(),
});

export const AdminValidation = {
  updateAdminZodSchema,
};
