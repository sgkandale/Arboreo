import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arboreo Family Tree",
  description: "Visualize your family tree",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
