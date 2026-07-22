"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormField, Input } from "@/components/ui";
import {
  adminLoginSchema,
  type AdminLoginFormValues,
} from "../../schemas/admin-login.schema";
import { adminLoginAction } from "../../actions/admin-login.action";
import styles from "./AdminLoginForm.module.css";

export function AdminLoginForm() {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    setServerMessage(null);
    const result = await adminLoginAction(values);

    if (!result.success) {
      setServerMessage(
        result.message ?? "Giriş zamanı xəta baş verdi. Yenidən cəhd edin."
      );
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <FormField
        id="admin-username"
        label="İstifadəçi adı"
        required
        error={errors.username?.message}
      >
        <Input
          id="admin-username"
          type="text"
          autoComplete="username"
          placeholder="admin"
          hasError={Boolean(errors.username)}
          {...register("username")}
        />
      </FormField>

      <FormField
        id="admin-password"
        label="Parol"
        required
        error={errors.password?.message}
      >
        <Input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••"
          hasError={Boolean(errors.password)}
          {...register("password")}
        />
      </FormField>

      {serverMessage ? (
        <p className={styles.serverMessage} role="alert">
          {serverMessage}
        </p>
      ) : null}

      <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
        Daxil ol
      </Button>
    </form>
  );
}
