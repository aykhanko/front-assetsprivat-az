import type { AuthenticatedUser } from "../types";

/**
 * Mock istifadəçi bazası.
 *
 * QEYD: Bu fayl YALNIZ `APP_DATA=mock` rejimində istifadə olunur.
 * Real backend hazır olduqda bu fayla ehtiyac qalmayacaq — servis
 * səviyyəsində `APP_DATA=api` seçimi ilə real API çağırışına keçiləcək.
 */
export interface MockUserRecord extends AuthenticatedUser {
  password: string;
}

export const MOCK_USERS: MockUserRecord[] = [
  {
    id: "usr-0001",
    username: "ayxan",
    password: "ayxan123",
    fullName: "Kərimli Ayxan",
    role: "administrator",
  },
];

export function findMockUserByCredentials(
  username: string,
  password: string
): MockUserRecord | undefined {
  return MOCK_USERS.find(
    (user) => user.username === username && user.password === password
  );
}

export function findMockUserByUsername(
  username: string
): MockUserRecord | undefined {
  return MOCK_USERS.find((user) => user.username === username);
}
