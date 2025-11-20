"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { useVehicles } from "@/context/VehicleContext";
import { useToast } from "@/components/ToastProvider";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import type { Vehicle } from "@/context/VehicleContext";

interface CSVRow {
  name?: string;
  year?: string;
  make?: string;
  model?: string;
  vin?: string;
  license_plate?: string;
  licensePlate?: string;
  license_plate_state?: string;
  licensePlateState?: string;
}

interface ValidationError {
  row: number;
  message: string;
}

interface PreviewVehicle extends Omit<Vehicle, "id"> {
  _rowIndex?: number;
  _errors?: string[];
}

export default function UploadVehiclesPage() {
  const router = useRouter();
  const { addVehicles } = useVehicles();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewData, setPreviewData] = useState<PreviewVehicle[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setPreviewData([]);
    setValidationErrors([]);

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validVehicles: PreviewVehicle[] = [];
        const errors: ValidationError[] = [];

        results.data.forEach((row, index) => {
          const name = row.name?.trim() || "";
          const year = row.year?.trim();
          const make = row.make?.trim();
          const model = row.model?.trim();
          const vin = row.vin?.trim();
          const licensePlate =
            row.license_plate?.trim() || row.licensePlate?.trim() || "";
          const licensePlateState =
            row.license_plate_state?.trim() || row.licensePlateState?.trim() || "";

          const rowErrors: string[] = [];
          
          if (!year) rowErrors.push("Missing year");
          if (!make) rowErrors.push("Missing make");
          if (!model) rowErrors.push("Missing model");
          if (!vin) rowErrors.push("Missing VIN");

          if (rowErrors.length > 0) {
            errors.push({
              row: index + 2, // +2 because index is 0-based and we skip header
              message: rowErrors.join(", "),
            });
          }

          // Use provided name, or default to license plate, or empty string
          const vehicleName = name || licensePlate || "";

          const vehicle: PreviewVehicle = {
            name: vehicleName,
            year: year || "",
            make: make || "",
            model: model || "",
            vin: vin || "",
            licensePlate,
            licensePlateState,
            _rowIndex: index + 2,
            _errors: rowErrors.length > 0 ? rowErrors : undefined,
          };

          validVehicles.push(vehicle);
        });

        setValidationErrors(errors);
        setPreviewData(validVehicles.slice(0, 5)); // Show first 5 rows

        if (errors.length > 0) {
          showToast(
            `${errors.length} row(s) have validation errors. ${validVehicles.length - errors.length} valid row(s) found.`,
            "info"
          );
        } else {
          showToast(
            `${validVehicles.length} valid vehicle(s) found.`,
            "success"
          );
        }

        setIsProcessing(false);
      },
      error: (error) => {
        showToast(`Error parsing CSV: ${error.message}`, "error");
        setIsProcessing(false);
      },
    });
  };

  const handleConfirmImport = () => {
    const validVehicles = previewData.filter((v) => !v._errors || v._errors.length === 0);
    
    if (validVehicles.length === 0) {
      showToast("No valid vehicles to import", "error");
      return;
    }

    // Remove internal fields before adding
    const vehiclesToAdd = validVehicles.map(({ _rowIndex, _errors, ...vehicle }) => vehicle);
    
    addVehicles(vehiclesToAdd);
    showToast(
      `Successfully imported ${vehiclesToAdd.length} vehicle(s)!`,
      "success"
    );
    setPreviewData([]);
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    router.push("/vehicles");
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (value: string, row: PreviewVehicle) => (
        <span className={row._errors ? "text-red-600" : ""}>
          {value || "—"}
        </span>
      ),
    },
    {
      key: "year",
      label: "Year",
      render: (value: string, row: PreviewVehicle) => (
        <span className={row._errors ? "text-red-600" : ""}>{value || "—"}</span>
      ),
    },
    {
      key: "make",
      label: "Make",
      render: (value: string, row: PreviewVehicle) => (
        <span className={row._errors ? "text-red-600" : ""}>{value || "—"}</span>
      ),
    },
    {
      key: "model",
      label: "Model",
      render: (value: string, row: PreviewVehicle) => (
        <span className={row._errors ? "text-red-600" : ""}>{value || "—"}</span>
      ),
    },
    {
      key: "vin",
      label: "VIN",
      truncate: true,
      render: (value: string, row: PreviewVehicle) => (
        <span className={`font-mono ${row._errors ? "text-red-600" : ""}`}>
          {value || "—"}
        </span>
      ),
    },
    {
      key: "licensePlate",
      label: "License Plate",
    },
    {
      key: "licensePlateState",
      label: "State",
      render: (value: string) => <span>{value || "—"}</span>,
    },
    {
      key: "errors",
      label: "Errors",
      render: (_: any, row: PreviewVehicle) => (
        <span className="text-sm text-red-600">
          {row._errors ? row._errors.join(", ") : "✓"}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-navy mb-8">Upload Vehicles (CSV)</h1>

      <Card
        title="CSV Import"
        description="Upload your full fleet roster at once. We validate your file before saving anything."
        className="mb-8"
      >
        <div className="mb-6">
          <label
            htmlFor="csv-file"
            className="block text-sm font-semibold text-gray-600 mb-2"
          >
            Select CSV File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="csv-file"
            accept=".csv"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#F15A29] file:text-white hover:file:bg-[#d43e1a] cursor-pointer"
          />
          <p className="mt-4 text-sm text-gray-600">
            Expected columns: <code className="bg-gray-100 px-2 py-1 rounded">year</code>,{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">make</code>,{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">model</code>,{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">vin</code>,{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">license_plate</code>,{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">license_plate_state</code>
            <br />
            <span className="text-gray-400 mt-1 block">
              Optional: <code className="bg-gray-100 px-2 py-1 rounded">name</code> (defaults to license plate if not provided)
            </span>
          </p>
          <p className="mt-4 text-sm">
            <a
              href="/sample-vehicles.csv"
              download
              className="text-[#F15A29] hover:underline font-medium"
            >
              📥 Download sample CSV file
            </a>
          </p>
        </div>

        {isProcessing && (
          <div className="text-center py-4 text-gray-600">Processing CSV...</div>
        )}
      </Card>

      {previewData.length > 0 && (
        <Card
          title={`Preview (${previewData.length} vehicles shown, ${validationErrors.length} with errors)`}
          className="mb-8"
        >
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Showing first 5 rows. Rows with errors are highlighted in red.
            </p>
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <p className="text-sm font-semibold text-red-800 mb-2">
                  Validation Errors Found:
                </p>
                <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                  {validationErrors.slice(0, 10).map((error) => (
                    <li key={error.row}>
                      Row {error.row}: {error.message}
                    </li>
                  ))}
                  {validationErrors.length > 10 && (
                    <li>... and {validationErrors.length - 10} more errors</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table
              columns={columns}
              data={previewData}
              keyExtractor={(row) => String(row._rowIndex ?? `${row.vin}-${row.licensePlate}`)}
              maxHeight="400px"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleConfirmImport} variant="primary">
              Confirm Import ({previewData.filter((v) => !v._errors || v._errors.length === 0).length} valid vehicles)
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-8">
        <Button variant="secondary" onClick={() => router.back()}>
          Back to Vehicles
        </Button>
      </div>
    </div>
  );
}
