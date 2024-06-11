import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/toaster";
import { boolean } from "drizzle-orm/mysql-core";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Obvious Surveys",
  description: "Intuitive surveys for due diligence",
  icons: [{ rel: "icon", url: "/obvious-round-icon.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
