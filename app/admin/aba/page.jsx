"use client";

import {useState} from "react";
import { usePaymentStore } from "../../store/payment/useAbaStore";


export default function Home(){

  const {payCard,payQr,qr,loading}=usePaymentStore();
  const [amount,setAmount]=useState("1.00");

  return (
    <div className="p-10 max-w-md mx-auto space-y-4">

      <input
        value={amount}
        onChange={e=>setAmount(e.target.value)}
        className="border p-3 w-full"
      />

<button disabled={loading} onClick={()=>payCard(amount)}>
        Pay Card
      </button>

      <button onClick={()=>payQr(amount)}
        className="bg-green-600 text-white w-full py-3">
        Pay QR
      </button>

      {loading && <p>Loading...</p>}

      {qr && (
        <img src={qr.qrImage} className="mx-auto"/>
      )}

    </div>
  );
}
