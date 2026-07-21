import type { Metadata, Viewport } from "next";
import { getClientEnv } from "@/lib/env/client";
import "./globals.css";

const env = getClientEnv();

export const metadata: Metadata = {
  title: {
    default: env.NEXT_PUBLIC_APP_NAME,
    template: `%s | ${env.NEXT_PUBLIC_APP_SHORT_NAME}`,
  },
  description:
    "Dövlət əmlakının özəlləşdirilməsinin təşkili şöbəsinin rəsmi elektron idarəetmə sistemi.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1730",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}
