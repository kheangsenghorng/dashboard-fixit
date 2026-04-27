import { Loader2 } from "lucide-react";

const SubmitButton = ({ loading, label, color }) => (
  <button
    type="submit"
    disabled={loading}
    className={`w-full ${color} text-white py-5 rounded-[2rem] font-black text-lg hover:opacity-90 shadow-2xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed`}
  >
    {loading ? <Loader2 className="animate-spin" /> : label}
  </button>
);

export default SubmitButton;