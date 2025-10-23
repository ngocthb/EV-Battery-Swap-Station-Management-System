import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3, "Tối thiểu 3 ký tự")
  .max(30, "Tối đa 30 ký tự")
  .regex(/^[a-zA-Z0-9_.-]+$/, "Chỉ cho phép chữ, số và _ . -");

export const emailSchema = z
  .string()
  .email("Email không hợp lệ")
  .transform((s) => s.toLowerCase());

export const passwordSchema = z
  .string()
  .min(8, "Mật khẩu tối thiểu 8 ký tự")
  .regex(/[a-z]/, "Phải có chữ thường")
  .regex(/[A-Z]/, "Phải có chữ hoa")
  .regex(/[0-9]/, "Phải có số")
  .regex(/[^\w\s]/, "Phải có ký tự đặc biệt");

export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const resendSchema = z.object({ email: emailSchema });

export const verifySchema = z.object({
  token: z.string().min(10, "Token không hợp lệ"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type ResendInput = z.infer<typeof resendSchema>;
export type VerifyInput = z.infer<typeof verifySchema>;
