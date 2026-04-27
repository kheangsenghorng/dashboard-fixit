import React from "react";
import { Upload, Table, Trash2, Loader2 } from "lucide-react";
import FormHeader from "./FormHeader";

const BulkImport = ({
  excelData,
  fileName,
  onUpload,
  onClear,
  onSubmit,
  loading,
}) => (
  <div className="space-y-8 animate-in fade-in">
    <FormHeader
      title="Bulk Import"
      subtitle="Upload spreadsheet to process records"
    />
    {!excelData.length ? (
      <div className="relative border-4 border-dashed border-slate-100 rounded-[3rem] p-16 flex flex-col items-center hover:bg-indigo-50/20 transition-all cursor-pointer">
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={onUpload}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="bg-indigo-600 p-6 rounded-3xl text-white mb-6">
          <Upload size={40} />
        </div>
        <p className="text-xl font-bold text-slate-700">
          Drop your Excel file here
        </p>
      </div>
    ) : (
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-indigo-50 p-6 rounded-3xl">
          <div className="flex items-center gap-4">
            <Table className="text-indigo-600" />
            <div>
              <p className="font-black text-indigo-900">{fileName}</p>
              <p className="text-sm">{excelData.length} records</p>
            </div>
          </div>
          <button onClick={onClear} className="text-red-500">
            <Trash2 />
          </button>
        </div>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black flex justify-center items-center gap-3"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Process Bulk Upload"
          )}
        </button>
      </div>
    )}
  </div>
);
export default BulkImport;
