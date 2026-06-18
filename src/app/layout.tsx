import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TargetResume AI",
  description:
    "Create tailored resume drafts from profile text, target roles, and company context.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
