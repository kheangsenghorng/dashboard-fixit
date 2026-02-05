 import { create } from "zustand";

// export const usePaymentStore = create((set, get) => ({

//   loading: false,
//   qr: null,
//   error: null,

//   // ================= CARD =================
//   // payCard: async(amount)=>{
//   //   set({loading:true});

//   //   const res = await fetch(
//   //     `${process.env.NEXT_PUBLIC_API_URL}/payment/payway/card`,
//   //     {
//   //       method:"POST",
//   //       headers:{ "Content-Type":"application/json"},
//   //       body: JSON.stringify({amount})
//   //     }
//   //   );
//   //   const data = await res.json();
    

//   //   set({loading:false});
//   //   // 🔥 open ABA popup
//   //   window.AbaPayway.checkout({
//   //     ...data,
//   //     view_type:"popup"
//   //   });
//   // },

//   // ================= QR =================
//   // payCard: async (amount) => {
//   //   set({ loading: true, error: null });

//   //   try {
//   //     // 1. Fetch the pre-hashed data from your Laravel API
//   //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/payway/card`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({ amount }),
//   //     });

//   //     if (!res.ok) throw new Error("Could not generate payment data");

//   //     const data = await res.json();

//   //     // 2. Create dynamic form to redirect user to ABA PayWay
//   //     const form = document.createElement("form");
//   //     form.method = "POST";
//   //     // Sandbox URL (Change to production URL for live)
//   //     form.action = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase";

//   //     // 3. Loop through the JSON data from Laravel and create hidden inputs
//   //     Object.keys(data).forEach((key) => {
//   //       const input = document.createElement("input");
//   //       input.type = "hidden";
//   //       input.name = key;
//   //       input.value = data[key];
//   //       form.appendChild(input);
//   //     });

//   //     // 4. Submit form
//   //     document.body.appendChild(form);
//   //     form.submit();
      
//   //     set({ loading: false });
//   //   } catch (e) {
//   //     console.error("Payment Error:", e.message);
//   //     set({ loading: false, error: e.message });
//   //   }
//   // },


// // ================= CARD (FORM REDIRECT) =================
// payCard: async (amount) => {
//   set({ loading: true, error: null });

//   try {
//     // 1. Get the hashed data from your Laravel API
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/payway/card`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount }),
//     });

//     if (!res.ok) throw new Error("Failed to initialize payment");
//     const data = await res.json();

//     // 2. Create a dynamic form to auto-submit
//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase";

//     // 3. Map all keys to hidden inputs
//     Object.keys(data).forEach((key) => {
//       const input = document.createElement("input");
//       input.type = "hidden";
//       input.name = key;
//       input.value = data[key] ?? ""; // Ensure no null values
//       form.appendChild(input);
//     });

//     // 4. Submit to ABA
//     document.body.appendChild(form);
//     form.submit();
    
//     // Cleanup (though the page will redirect shortly)
//     setTimeout(() => set({ loading: false }), 2000);
//   } catch (e) {
//     set({ loading: false, error: e.message });
//   }
// },
// }));
// store/payment/useAbaStore.js
export const usePaymentStore = create((set) => ({
  loading: false,
  error: null,

  payCard: async (amount) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/payway/card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      
      const data = await res.json();

      // Create the HTML Form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase";

      // Append all fields from your cURL requirement
      Object.keys(data).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = data[key] ?? "";
        form.appendChild(input);
      });

      // Inject into DOM and submit
      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      set({ loading: false, error: e.message });
    }
  },
}));