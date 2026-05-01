import React from "react";
import { AlertCircle, Wallet } from "lucide-react";

const StateCards = ({ loading, error, empty, ownerId, fetchPayouts }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-12 border border-slate-200 shadow-sm text-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-slate-600">Loading details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[2rem] p-12 border border-slate-200 shadow-sm text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={46} />
        <h2 className="text-xl font-black text-slate-900 mb-2">
          Error Loading Data
        </h2>
        <p className="text-sm text-slate-500 mb-6">{error}</p>
        <button
          onClick={() => fetchPayouts({ owner_id: ownerId })}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold"
        >
          Retry
        </button>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="bg-white rounded-[2rem] p-12 border border-slate-200 shadow-sm text-center">
        <Wallet className="mx-auto text-slate-300 mb-4" size={52} />
        <h2 className="text-xl font-black text-slate-900 mb-2">No Records</h2>
        <p className="text-sm text-slate-500 font-medium">
          This owner has no payout history.
        </p>
      </div>
    );
  }

  return null;
};

export default StateCards;
