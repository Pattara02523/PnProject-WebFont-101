import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  avatarUrl: z.string().optional()
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
