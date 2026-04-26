"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
};

export default function PriceInput({ value, onChange, placeholder = "0,00", className = "", required }: Props) {
  return (
    <div className="flex">
      <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-500 select-none shrink-0">
        R$
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`flex-1 border border-gray-200 rounded-r-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/30 focus:border-[#2E86AB] ${className}`}
      />
    </div>
  );
}
