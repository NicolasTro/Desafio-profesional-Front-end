"use client";
import React from "react";
import Header from "@/Components/Header";
import SlideMenu from "@/Components/SlideMenu";
import Footer from "@/Components/Footer";
import { useAppContext } from "@/Context/AppContext";

export default function ClientLayoutWithAuth({ children }: { children: React.ReactNode }) {
  const { userInfo, isLoggingOut } = useAppContext();
  return (

    <div className="global-content">
      <Header />

      <div className="main-content">
        {userInfo && !isLoggingOut && <SlideMenu />}
        <main>{children}</main>

      </div>

      <Footer />
 
    </div>
  );
}
