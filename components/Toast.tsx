"use client";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const bgColor =
    type === "success"
      ? "bg-green"
      : type === "error"
      ? "bg-[#f04f23]"
      : "bg-navy";

  return (
    <div
      className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md flex items-center justify-between gap-4 animate-slide-in`}
    >
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition-colors font-bold"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

