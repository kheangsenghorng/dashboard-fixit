"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditUserPage from "../../../../../Components/admin/edit/users/EditUserPage";
import { useUsersStore } from "../../../../store/useUsersStore";
import { ArrowLeft, XCircle } from "lucide-react";
import LoadingCard from "../../../../../Components/LoadingCard";

export default function EditUserClient() {
  const { id } = useParams();
  const router = useRouter();

  const user = useUsersStore((s) => s.user);
  const loading = useUsersStore((s) => s.loading);
  const fetchUser = useUsersStore((s) => s.fetchUser);
  const updateUser = useUsersStore((s) => s.updateUser);



  // --- DELAY LOGIC ---
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (id) fetchUser(id);
  }, [id, fetchUser]);

  // Handle the minimum delay for the loader
  useEffect(() => {
    if (loading) {
      setShowLoader(true);
    } else {
      // Ensure loader stays for at least 800ms for high-end feel
      const timer = setTimeout(() => setShowLoader(false), 800);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleBack = () => router.back();

  
 // 1. FULL PAGE LOADER (With Delay)
 if (showLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingCard />
      </div>
    );
  }
  
  
  // 2. USER NOT FOUND (New Cut Style)
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative group w-full max-w-md">
          
          {/* BRUTALIST SHADOW */}
          <div className="absolute inset-0 bg-slate-900 translate-x-3 translate-y-3 rounded-2xl -z-10" />
          
          {/* ERROR CARD */}
          <div className="relative bg-white border-2 border-slate-900 p-12 rounded-2xl text-center [clip-path:polygon(0%_0%,_100%_0%,_100%_90%,_90%_100%,_0%_100%)]">
            
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-100 rounded-2xl animate-ping opacity-20" />
                <div className="relative w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center border-2 border-red-100 text-red-500">
                  <XCircle size={40} />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">
                  Record <span className="text-red-600">Missing</span>
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px w-4 bg-slate-200" />
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    ID: {id || "NULL_REF"}
                  </p>
                  <div className="h-px w-4 bg-slate-200" />
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed max-w-[260px]">
                The requested identity does not exist in the secure database or has been de-indexed.
              </p>

              {/* ACTION BUTTON */}
              <button 
                onClick={handleBack}
                className="mt-4 group relative flex items-center gap-3 px-8 py-3 bg-slate-900 text-white font-black italic uppercase tracking-widest text-xs transition-all hover:bg-red-600 active:scale-95"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 90% 100%, 0 100%)' }}
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Return to Base</span>
              </button>
            </div>

            {/* SYSTEM TAG */}
            <div className="absolute top-4 right-6 text-[9px] font-mono text-slate-200 uppercase tracking-[0.3em] rotate-90 origin-right">
              ERR_404
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. ACTUAL CONTENT
  return (
    <EditUserPage
      userData={user}
      onBack={handleBack}
    />
  );
}