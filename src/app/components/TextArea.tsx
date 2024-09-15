import React from "react";

type TextAreaProps = {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
};

export default function TextArea({ value, onChange }: TextAreaProps) {
  return (
    <div className="my-5 ">
      <textarea
        className="w-full h-64 px-2 py-2 border rounded border-slate-400 bg-slate-700"
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}
