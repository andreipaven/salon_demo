import { Space_Grotesk, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";

// Both families are variable fonts: omitting `weight` ships ONE file per family
// that covers the whole weight axis, instead of one static file per weight.
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "NORD — Hairstyling Studio",
  description:
    "Hairstyling profesional. Atenție la detalii. Stil personalizat. Un studio modern de coafură pentru bărbați.",
};

export const viewport = {
  themeColor: "#f6f7f9",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${display.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
