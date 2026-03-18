import type { Metadata } from "next";

import Footer from "@/components/Footer";

import "./globals.css";

export const metadata: Metadata = {
  title: "An ka dambé | Plateforme de l'artisanat et de la culture malienne",
  description:
    "Découvrez An ka dambé, la plateforme dédiée à l'artisanat et à la culture malienne : bogolans, sculptures, bijoux touaregs et pièces authentiques.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-sand text-ink antialiased">
        <div className="flex min-h-screen flex-col">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
