import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "./providers/ToastProvider";
import "leaflet/dist/leaflet.css";
import AuthInitializer from "./AuthInitializer";
import ListenToastProvider from "./providers/ListenToastProvider";
import RealtimeListeners from "../Components/realtime/RealtimeListeners";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fixit",
  description: "Fixit Service Marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthInitializer />
        <RealtimeListeners />
        {children}

        {/* ✅ Toasts available everywhere */}
        <ListenToastProvider />
        <ToastProvider />
      </body>
    </html>
  );
}
