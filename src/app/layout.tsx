import "~/styles/globals.css";

import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "~/trpc/react";
import { Bricolage_Grotesque, Urbanist } from "next/font/google";

export const metadata: Metadata = {
  title: {
    default: "Plyst | Deine digitale Identität",
    template: "%s | Plyst",
  },
  description:
    "Erstelle in Sekunden eine wunderschöne Landingpage für deine Links und Socials. Komplett anpassbar, extrem schnell.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${bricolage.variable} ${urbanist.variable}`}>
        <body className="bg-slate-50">
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
