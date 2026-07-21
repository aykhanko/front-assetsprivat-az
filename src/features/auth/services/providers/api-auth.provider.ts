import { getServerEnv } from "@/lib/env/server";
import type { LoginFormValues } from "../../schemas/login.schema";
import type { LoginResult } from "../../types";

/**
 * Real API autentifikasiya provayderi. `APP_DATA=api` olduqda istifadə
 * olunacaq. Backend endpoint-i təsdiqləndikdə, aşağıdaki URL və cavab
 * strukturunu real kontraktla uzlaşdırın.
 */
export async function loginWithApiProvider(
  values: LoginFormValues
): Promise<LoginResult> {
  const env = getServerEnv();

  if (!env.API_BASE_URL) {
    return {
      success: false,
      message:
        "API_BASE_URL konfiqurasiya edilməyib. Zəhmət olmasa mühit dəyişənlərini yoxlayın.",
    };
  }

  const response = await fetch(`${env.API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: values.username,
      password: values.password,
    }),
    signal: AbortSignal.timeout(env.API_TIMEOUT_MS),
  });

  if (!response.ok) {
    return {
      success: false,
      message: "İstifadəçi adı və ya parol yanlışdır.",
    };
  }

  const data = await response.json();

  return {
    success: true,
    user: data.user,
  };
}
