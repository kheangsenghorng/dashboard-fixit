"use client";

import FloatingStartSelling from "../../Components/FloatingStartSelling";
import Footer from "../../Components/nabvar/Footer";
import Navbar from "../../Components/nabvar/Navbar";

// import BecomeSellerButton from "@/components/ui/BecomeSellerButton";

export default function UserLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#fcfdfe]">
      {/* Navbar Fixed Top */}
      <div className="flex-grow pt-24">
        <Navbar />
      </div>

      {/* Page Content */}
      <main>{children}</main>
      <FloatingStartSelling />
      <Footer />
      {/* <BecomeSellerButton /> */}
    </div>
  );
}
