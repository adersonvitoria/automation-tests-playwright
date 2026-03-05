import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  avatar: z.string().url(),
});

export const SupportSchema = z.object({
  url: z.string().url(),
  text: z.string().min(1),
});

export const UserListResponseSchema = z.object({
  page: z.number().int().positive(),
  per_page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  total_pages: z.number().int().positive(),
  data: z.array(UserSchema),
  support: SupportSchema,
});

export const SingleUserResponseSchema = z.object({
  data: UserSchema,
  support: SupportSchema,
});

export const CreatedUserSchema = z.object({
  name: z.string().optional(),
  job: z.string().optional(),
  id: z.string(),
  createdAt: z.string(),
});

export const UpdatedUserSchema = z.object({
  name: z.string().optional(),
  job: z.string().optional(),
  updatedAt: z.string(),
});

export const RegisterResponseSchema = z.object({
  id: z.number(),
  token: z.string().min(1),
});

export const LoginResponseSchema = z.object({
  token: z.string().min(1),
});

export const ErrorResponseSchema = z.object({
  error: z.string().min(1),
});

export const ResourceSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  year: z.number(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  pantone_value: z.string().min(1),
});

export const ResourceListResponseSchema = z.object({
  page: z.number().int().positive(),
  per_page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  total_pages: z.number().int().positive(),
  data: z.array(ResourceSchema),
  support: SupportSchema,
});

export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}
