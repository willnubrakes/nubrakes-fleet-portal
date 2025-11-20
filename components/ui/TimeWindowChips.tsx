"use client";

interface TimeWindowChipsProps {
  value: string;
  onChange: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
}

const DEFAULT_OPTIONS = [
  { value: "Morning", label: "Morning (9am–12pm)" },
  { value: "Afternoon", label: "Afternoon (12pm–4pm)" },
  { value: "Anytime", label: "Anytime" },
];

export function TimeWindowChips({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
}: TimeWindowChipsProps) {
  return (
    <div className="flex gap-3 flex-wrap">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            value === option.value
              ? "bg-[#F15A29] text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

