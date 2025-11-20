"use client";

import Link from "next/link";
import { useVehicles } from "@/context/VehicleContext";
import { Table } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Vehicle } from "@/context/VehicleContext";

export default function VehiclesPage() {
  const { vehicles, deleteVehicle } = useVehicles();

  const handleDelete = (vehicle: Vehicle) => {
    if (
      confirm(
        `Are you sure you want to delete ${vehicle.name || vehicle.vin}?`
      )
    ) {
      deleteVehicle(vehicle.id);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value: string, row: Vehicle) => (
        <span className="text-sm font-medium text-gray-900">
          {value || "—"}
        </span>
      ),
    },
    {
      key: "year",
      label: "Year",
      sortable: true,
      width: "80px",
    },
    {
      key: "make",
      label: "Make",
      sortable: true,
    },
    {
      key: "model",
      label: "Model",
      sortable: true,
    },
    {
      key: "vin",
      label: "VIN",
      sortable: true,
      truncate: true,
      render: (value: string) => (
        <span className="text-sm text-gray-500 font-mono">{value}</span>
      ),
    },
    {
      key: "licensePlate",
      label: "License Plate",
      sortable: true,
    },
    {
      key: "licensePlateState",
      label: "State",
      sortable: true,
      render: (value: string) => <span>{value || "—"}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (_: any, row: Vehicle) => (
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label={`Delete ${row.name || row.vin}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-navy">Vehicle Roster</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/vehicles/new"
            className="bg-[#F15A29] text-white px-6 py-3 rounded-md hover:bg-[#d43e1a] transition-colors font-medium h-11 flex items-center justify-center"
          >
            Add Vehicle
          </Link>
          <Link
            href="/vehicles/upload"
            className="bg-navy text-white px-6 py-3 rounded-md hover:bg-navy/90 transition-colors font-medium h-11 flex items-center justify-center"
          >
            Upload CSV
          </Link>
        </div>
      </div>

      {vehicles.length === 0 ? (
        <EmptyState
          title="No vehicles in your roster yet"
          description="Get started by adding your first vehicle or uploading a CSV file with your full fleet roster."
          primaryAction={{
            label: "Add Vehicle",
            href: "/vehicles/new",
          }}
          secondaryAction={{
            label: "Upload CSV",
            href: "/vehicles/upload",
          }}
          icon={
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table
            columns={columns}
            data={vehicles}
            keyExtractor={(row) => row.id}
            maxHeight="600px"
          />
        </div>
      )}
    </div>
  );
}
