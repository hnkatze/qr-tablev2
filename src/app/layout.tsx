import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mesa — Comandas QR para tu restaurante",
  description:
    "Comandas digitales para cafés, comida rápida y emprendedores. Tu carta en cada mesa, sin esperar al mesero. Setup en 10 minutos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col text-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-dot-pattern opacity-70" />
          <div className="absolute -top-32 -left-32 size-[44rem] rounded-full bg-brand-tangerine/35 blur-3xl animate-blob" />
          <div className="absolute top-1/4 -right-40 size-[40rem] rounded-full bg-brand-mint/40 blur-3xl animate-blob-alt" />
          <div className="absolute top-2/3 left-1/4 size-[36rem] rounded-full bg-brand-grape/25 blur-3xl animate-blob" />
          <div className="absolute -bottom-32 right-1/4 size-[32rem] rounded-full bg-brand-tangerine/25 blur-3xl animate-blob-alt" />
        </div>
        {children}
      </body>
    </html>
  );
}
