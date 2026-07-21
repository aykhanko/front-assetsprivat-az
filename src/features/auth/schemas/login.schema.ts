import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "İstifadəçi adı daxil edilməlidir")
    .max(64, "İstifadəçi adı 64 simvoldan çox ola bilməz"),
  password: z
    .string()
    .min(1, "Parol daxil edilməlidir")
    .min(6, "Parol ən azı 6 simvoldan ibarət olmalıdır"),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
