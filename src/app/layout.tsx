import type { Metadata } from "next";
import localFont from "next/font/local";
import { business } from "@/config/business";
import "./globals.css";
const displayFont = localFont({
  src: "../fonts/manrope-latin.woff2",
  variable: "--font-display",
  display: "optional",
  weight: "400 800",
  fallback: ["Arial"],
});
const bodyFont = localFont({
  src: "../fonts/dm-sans-latin.woff2",
  variable: "--font-body",
  display: "optional",
  weight: "400 700",
  fallback: ["Arial"],
});
export const metadata: Metadata = {
  title: business.name + " — Proteção começa na embalagem.",
  description:
    "Caixas de papelão para e-commerce, transporte e projetos sob medida em Curitiba, Campo Largo e regiões metropolitanas próximas.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={displayFont.variable + " " + bodyFont.variable}
    >
      <body>{children}</body>
    </html>
  );
}
