"use client";

import { ReactNode, useState } from "react";
import { Tooltip } from "./Tooltip";

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => ReactNode;
  width?: string;
  truncate?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  className?: string;
  maxHeight?: string;
}

type SortDirection = "asc" | "desc" | null;

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  className = "",
  maxHeight = "600px",
}: TableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue === bValue) return 0;

    const comparison = aValue < bValue ? -1 : 1;
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const getCellContent = (column: Column<T>, row: T) => {
    const value = row[column.key as keyof T];
    
    if (column.render) {
      return column.render(value, row);
    }

    if (column.truncate && typeof value === "string" && value.length > 15) {
      return (
        <Tooltip content={value}>
          <span className="truncate block max-w-[150px]">{value}</span>
        </Tooltip>
      );
    }

    return value || "—";
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className={`table-container hidden md:block ${className}`} style={{ maxHeight }}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 table-fixed-header">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                    }`}
                    style={column.width ? { width: column.width } : undefined}
                    onClick={() => column.sortable && handleSort(String(column.key))}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && sortColumn === String(column.key) && (
                        <span className="text-[#F15A29]">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((row, index) => (
                <tr
                  key={keyExtractor(row)}
                  className={`table-row-hover ${
                    index % 2 === 1 ? "table-row-alternate" : ""
                  } ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {getCellContent(column, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {sortedData.map((row, index) => (
          <div
            key={keyExtractor(row)}
            className={`bg-white rounded-lg shadow-md p-4 border border-gray-200 ${
              onRowClick ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
            }`}
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((column) => {
              if (String(column.key) === "actions" && !column.label) return null;
              return (
                <div key={String(column.key)} className="mb-3 last:mb-0">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    {column.label}
                  </div>
                  <div className="text-sm text-gray-900">
                    {getCellContent(column, row)}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

