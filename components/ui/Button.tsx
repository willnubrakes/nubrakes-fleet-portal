"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-md font-medium transition-colors h-11 flex items-center justify-center";
  
  const variantStyles = {
    primary: "bg-[#34BB4B] text-white hover:bg-[#2da83f]",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

