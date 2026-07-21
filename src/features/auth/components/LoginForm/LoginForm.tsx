"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormField, Input } from "@/components/ui";
import { loginSchema, type LoginFormValues } from "../../schemas/login.schema";
import { loginAction } from "../../actions/login.action";
import styles from "./LoginForm.module.css";

export function LoginForm() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerMessage(null);
    const result = await loginAction(values);

    if (!result.success) {
      setServerMessage(
        result.message ?? "Giriş zamanı xəta baş verdi. Yenidən cəhd edin."
      );
      return;
    }

    router.push("/dashboard");
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <FormField
        id="username"
        label="İstifadəçi adı"
        required
        error={errors.username?.message}
      >
        <Input
          id="username"
          type="text"
          autoComplete="username"
          placeholder="İstifadəçi adınızı daxil edin"
          hasError={Boolean(errors.username)}
          startIcon={<UserIcon />}
          {...register("username")}
        />
      </FormField>

      <FormField
        id="password"
        label="Parol"
        required
        error={errors.password?.message}
      >
        <Input
          id="password"
          type={isPasswordVisible ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Parolunuzu daxil edin"
          hasError={Boolean(errors.password)}
          startIcon={<LockIcon />}
          endAdornment={
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              aria-label={
                isPasswordVisible ? "Parolu gizlət" : "Parolu göstər"
              }
            >
              {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          }
          {...register("password")}
        />
      </FormField>

      <div className={styles.formRow}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            {...register("rememberMe")}
          />
          Məni yadda saxla
        </label>
      </div>

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

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 20.25c0-3.728 3.582-6.75 8-6.75s8 3.022 8 6.75"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="5"
        y="10.5"
        width="14"
        height="9.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 10.5V7.75a4 4 0 1 1 8 0V10.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9.9 5.2A9.9 9.9 0 0 1 12 5c6 0 9.5 6.5 9.5 6.5a13.9 13.9 0 0 1-3.1 3.9M6.5 7.5C4.2 9 2.5 11.5 2.5 11.5S6 18 12 18a9.6 9.6 0 0 0 3.1-.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9.9 13.9a2.5 2.5 0 0 0 3.6-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
