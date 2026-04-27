import React from "react";
import { User, Layers, ShieldCheck, Activity } from "lucide-react";
import FormHeader from "./FormHeader";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";

const ProviderForm = ({
  selectedUser,
  selectedCategory,
  onOpenUser,
  onOpenCat,
  onSubmit,
  loading,
}) => (
  <form
    onSubmit={(e) => onSubmit(e, "Provider")}
    className="space-y-8 animate-in fade-in duration-500"
  >
    <FormHeader
      title="Provider Details"
      subtitle="Connect a user to a service provider role"
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* User Selection */}
      <div onClick={onOpenUser} className="cursor-pointer group">
        <FormInput
          icon={<User />}
          label="Select User"
          name="user_id"
          value={
            selectedUser ? `${selectedUser.name} (ID: ${selectedUser.id})` : ""
          }
          placeholder="Click to select user..."
          readOnly
        />
      </div>

      {/* Category Selection */}
      <div onClick={onOpenCat} className="cursor-pointer group">
        <FormInput
          icon={<Layers />}
          label="Select Category"
          name="category_id"
          value={
            selectedCategory
              ? `${selectedCategory.name} (ID: ${selectedCategory.id})`
              : ""
          }
          placeholder="Click to select category..."
          readOnly
        />
      </div>
    </div>

    {/* Automatic Settings Badge - Clear UI Style */}
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 w-full mb-1">
        Automatic Settings
      </p>

      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
        <Activity size={14} className="text-emerald-500" />
        <span className="text-xs font-semibold text-slate-600">
          Status: Active
        </span>
      </div>

      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
        <ShieldCheck size={14} className="text-indigo-500" />
        <span className="text-xs font-semibold text-slate-600">
          Type: Staff
        </span>
      </div>
    </div>

    <SubmitButton
      loading={loading}
      label="Register Provider"
      color="bg-indigo-600"
    />
  </form>
);

export default ProviderForm;
