import React from "react";

type InputProps = {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

export default function Input({ label, value, onChange }: InputProps) {
  return (
    <div className="my-5">
      <label className="w-1/6 px-3 py-2 bg-slate-600">{label}</label>
      <input
        type="text"
        value={value}
        className="w-4/6 px-2 py-1 mx-4 border rounded border-slate-400 bg-slate-700"
        onChange={onChange}
        required
      />
    </div>
  );
}
