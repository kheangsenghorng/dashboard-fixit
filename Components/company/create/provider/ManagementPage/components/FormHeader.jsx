const FormHeader = ({ title, subtitle }) => (
    <div className="border-b border-slate-100 pb-6">
      <h2 className="text-3xl font-black text-slate-800 tracking-tight">
        {title}
      </h2>
  
      <p className="text-slate-400 font-medium mt-1">{subtitle}</p>
    </div>
  );
  
  export default FormHeader;