"use client";

import FloatingStartSelling from "../../Components/FloatingStartSelling";
import Footer from "../../Components/nabvar/Footer";
import Navbar from "../../Components/nabvar/Navbar";
import Sidebar from "../../Components/profile/Sidebar";
import BottomNav from "../../Components/profile/BottomNav"; // Import the BottomNav

export default function UserLayout({ children }) {
  
  return (
    <div className="relative min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-24 lg:pt-32 pb-32 lg:pb-20 flex flex-col lg:flex-row gap-10">
        {/* Sidebar: Visible ONLY on Desktop */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full">{children}</main>
      </div>

      {/* Bottom Nav: Visible ONLY on Mobile */}
      <BottomNav />

      <FloatingStartSelling />
      <Footer />
    </div>
  );
}
