"use client";

import { ReactNode } from "react";

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
}

export function Card({
  title,
  description,
  children,
  className = "",
  headerClassName = "",
}: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {(title || description) && (
        <div className={`px-6 py-4 border-b border-gray-200 ${headerClassName}`}>
          {title && (
            <h2 className="text-xl font-semibold text-navy mb-1">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

