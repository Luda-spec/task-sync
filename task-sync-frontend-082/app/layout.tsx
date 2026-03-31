import type { Metadata } from "next";
import { Lexend_Deca as LexendDeca } from "next/font/google";
import "./globals.css";

const lexendDeca = LexendDeca({
  variable: "--font-lexend-deca",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Task Sync",
  description: "Productive task management tool",
  icons: {
    icon: "/favicon.png", 
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lexendDeca.variable}>
        {children}
      </body>
    </html>
  );
}