import React from "react";
import { Receipt } from "lucide-react";
import PayoutCard from "./PayoutCard";

const TransactionsList = ({ payouts }) => {
  return (
    <>
      <div className="flex items-center justify-between px-2 mb-6">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Receipt size={22} className="text-indigo-600" />
          Transactions
        </h2>
      </div>

      <div className="space-y-6">
        {payouts.map((item) => (
          <PayoutCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
};

export default TransactionsList;
