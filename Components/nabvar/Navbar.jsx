"use client";

import { Menu } from "lucide-react";
// import UserActions from "./UserActions";

export default function Navbar() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] py-0">
        <header className="mx-auto max-w-full bg-white border-b border-slate-100 px-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-5">
            {/* BRAND */}
            <div className="flex items-center gap-4 lg:gap-10">
              <a href="/" className="group flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-black text-slate-900 tracking-tighter leading-none uppercase">
                    Saby-Tinh
                  </span>
                </div>
              </a>

              {/* <NavLinks
                categories={categories}
                brands={brands}
                stores={stores}
                isScrolled={false}
              /> */}
            </div>

            {/* <SearchBar isScrolled={false} /> */}

            <div className="flex items-center gap-2 sm:gap-3">
              {/* <UserActions userProfile={userProfile} isScrolled={false} /> */}

              <button
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
                aria-label="Open Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
