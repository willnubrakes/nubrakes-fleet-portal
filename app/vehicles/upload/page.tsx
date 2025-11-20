"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { useVehicles } from "@/context/VehicleContext";
import { useToast } from "@/components/ToastProvider";
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

export default function UploadVehiclesPage() {
  const router = useRouter();
  const { addVehicles } = useVehicles();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewData, setPreviewData] = useState<Omit<Vehicle, "id">[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validVehicles: Omit<Vehicle, "id">[] = [];
        const errors: string[] = [];

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

          if (!year || !make || !model || !vin) {
            errors.push(
              `Row ${index + 2}: Missing required fields (year, make, model, or vin)`
            );
            return;
          }

          // Use provided name, or default to license plate, or empty string
          const vehicleName = name || licensePlate || "";

          validVehicles.push({
            name: vehicleName,
            year,
            make,
            model,
            vin,
            licensePlate,
            licensePlateState,
          });
        });

        if (errors.length > 0) {
          showToast(
            `${errors.length} row(s) skipped due to missing data. ${validVehicles.length} valid row(s) found.`,
            "info"
          );
        }

        setPreviewData(validVehicles);
        setIsProcessing(false);
      },
      error: (error) => {
        showToast(`Error parsing CSV: ${error.message}`, "error");
        setIsProcessing(false);
      },
    });
  };

  const handleConfirmImport = () => {
    if (previewData.length === 0) {
      showToast("No valid vehicles to import", "error");
      return;
    }

    addVehicles(previewData);
    showToast(
      `Successfully imported ${previewData.length} vehicle(s)!`,
      "success"
    );
    setPreviewData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    router.push("/vehicles");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-navy mb-8">Upload Vehicles (CSV)</h1>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="mb-6">
          <label
            htmlFor="csv-file"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select CSV File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            id="csv-file"
            accept=".csv"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#f04f23] file:text-white hover:file:bg-[#d43e1a] cursor-pointer"
          />
          <p className="mt-2 text-sm text-gray-500">
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
          <p className="mt-2 text-sm">
            <a
              href="/sample-vehicles.csv"
              download
              className="text-[#f04f23] hover:underline font-medium"
            >
              📥 Download sample CSV file
            </a>
          </p>
        </div>

        {isProcessing && (
          <div className="text-center py-4 text-gray-600">Processing CSV...</div>
        )}
      </div>

      {previewData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-navy">
              Preview ({previewData.length} vehicles)
            </h2>
            <button
              onClick={handleConfirmImport}
              className="bg-green text-white px-6 py-2 rounded-md hover:bg-green/90 transition-colors font-medium"
            >
              Confirm Import
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Make
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VIN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License Plate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    State
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((vehicle, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicle.name || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.make}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {vehicle.vin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.licensePlate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.licensePlateState || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
        >
          Back to Vehicles
        </button>
      </div>
    </div>
  );
}

