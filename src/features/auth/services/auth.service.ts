import { getDataSourceMode } from "@/lib/data-source";
import type { LoginFormValues } from "../schemas/login.schema";
import type { LoginResult } from "../types";
import { loginWithMockProvider } from "./providers/mock-auth.provider";
import { loginWithApiProvider } from "./providers/api-auth.provider";

/**
 * Autentifikasiya servisi.
 *
 * `APP_DATA` mühit dəyişəninə əsasən "mock" və ya "api" provayderinə
 * yönləndirir. Çağıran kod (server action, route handler) həmişə bu
 * funksiyanı istifadə etməlidir — provayder detalları ilə maraqlanmamalıdır.
 * Bu sayədə `APP_DATA=api`-ə keçid zamanı yalnız provayder qatı işə düşür,
 * çağıran kodda heç bir dəyişiklik lazım olmur.
 */
export async function login(values: LoginFormValues): Promise<LoginResult> {
  if (!values.username || !values.password) {
    return {
      success: false,
      message: "İstifadəçi adı və parol tələb olunur.",
    };
  }

  const mode = getDataSourceMode();

  if (mode === "api") {
    return loginWithApiProvider(values);
  }

  return loginWithMockProvider(values);
}
