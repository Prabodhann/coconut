import type { Metadata } from "next";
import { AppBootstrap } from "@/components/AppBootstrap";
import { BackendWarmup } from "@/components/BackendWarmup";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReduxProvider } from "@/store/provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coconut | Food delivery, thoughtfully made",
  description: "Discover, order, and track your favourite meals with Coconut.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <ThemeInitializer />
          <BackendWarmup />
          <AppBootstrap />
          {children}
          <ToastContainer
            position="bottom-center"
            autoClose={3500}
            theme="colored"
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
