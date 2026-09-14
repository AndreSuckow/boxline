import type { Metadata } from "next";
import { business } from "@/config/business";
import "./globals.css";
export const metadata: Metadata = {
  title: business.name + " — Proteção começa na embalagem.",
  description:
    "Caixas de papelão para e-commerce, transporte e projetos sob medida. Conheça a engenharia por trás de cada caixa e solicite seu orçamento.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
