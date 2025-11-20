"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      {icon && <div className="mb-6 flex justify-center">{icon}</div>}
      <h3 className="text-xl font-semibold text-navy mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      <div className="flex gap-4 justify-center">
        {primaryAction && (
          <Link
            href={primaryAction.href}
            className="bg-[#F15A29] text-white px-6 py-3 rounded-md hover:bg-[#d43e1a] transition-colors font-medium inline-block"
          >
            {primaryAction.label}
          </Link>
        )}
        {secondaryAction && (
          <Link
            href={secondaryAction.href}
            className="bg-white text-gray-700 px-6 py-3 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors font-medium inline-block"
          >
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
}

