import { create } from "zustand";

export const usePaymentStore = create((set, get) => ({

  loading: false,
  qr: null,
  error: null,

  // ================= CARD =================
  payCard: async(amount)=>{
    set({loading:true});

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/payway/card`,
      {
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({amount})
      }
    );

    const data = await res.json();

    set({loading:false});

    // 🔥 open ABA popup
    window.AbaPayway.checkout({
      ...data,
      view_type:"popup"
    });
  },

  // ================= QR =================
  payQr: async (amount) => {
    if (get().loading) return;

    set({ loading: true, qr: null, error: null });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/payway/qr`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        }
      );

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      set({ qr: data, loading: false });

    } catch (e) {
      console.error(e);
      set({ loading: false, error: e.message });
    }
  },

}));
