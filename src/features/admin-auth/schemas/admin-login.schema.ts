import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z.string().min(1, "İstifadəçi adı daxil edilməlidir"),
  password: z.string().min(1, "Parol daxil edilməlidir"),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
