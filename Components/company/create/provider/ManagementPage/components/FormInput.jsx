const FormInput = ({ label, icon, ...props }) => (
    <div className="space-y-2 group">
      <label className="text-xs font-black uppercase text-slate-400 ml-1 group-focus-within:text-indigo-600 transition-colors tracking-widest">
        {label}
      </label>
  
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
          {icon}
        </div>
  
        <input
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium placeholder:text-slate-300"
          {...props}
        />
      </div>
    </div>
  );
  
  export default FormInput;