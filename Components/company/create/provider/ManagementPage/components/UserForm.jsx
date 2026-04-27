import React from "react";
import { User, Mail, ShieldCheck } from "lucide-react";
import FormHeader from "./FormHeader";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";

const UserForm = ({ data, onChange, onSubmit, loading }) => (
  <form
    onSubmit={(e) => onSubmit(e, "User")}
    className="space-y-8 animate-in fade-in duration-500"
  >
    <FormHeader
      title="User Registration"
      subtitle="Auto-generated password will be sent via email"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        icon={<User />}
        label="Full Name"
        name="name"
        value={data.name}
        onChange={onChange}
        placeholder="John Doe"
        required
      />
      <FormInput
        icon={<Mail />}
        label="Email Address"
        type="email"
        name="email"
        value={data.email}
        onChange={onChange}
        placeholder="john@example.com"
        required
      />
      <FormInput
        icon={<ShieldCheck />}
        label="Phone"
        name="phone"
        value={data.phone}
        onChange={onChange}
        placeholder="012345678"
      />
    </div>
    <SubmitButton
      loading={loading}
      label="Create User Account"
      color="bg-slate-900"
    />
  </form>
);

export default UserForm;
