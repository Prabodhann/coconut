"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { LoginPopup } from "@/components/LoginPopup";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Navbar setShowLogin={setShowLogin} />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <main>{children}</main>
      <Footer />
    </>
  );
}
