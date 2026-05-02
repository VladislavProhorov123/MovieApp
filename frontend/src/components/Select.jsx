import React from "react";

export default function Select({ value, onChange, options, label }) {
  return (
    <div className="relative w-[180px] sm:w-[200px]">
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full
            appearance-none
            bg-white/5
            text-white
            px-4 py-3
            rounded-lg
            border border-white/10
            outline-none
            cursor-pointer
            hover:bg-white/10
            transition
          "
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-black">
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          ▼
        </div>
      </div>
    </div>
  );
}