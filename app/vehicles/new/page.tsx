"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVehicles } from "@/context/VehicleContext";
import { useToast } from "@/components/ToastProvider";

export default function NewVehiclePage() {
  const router = useRouter();
  const { addVehicle } = useVehicles();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    year: "",
    make: "",
    model: "",
    vin: "",
    licensePlate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-set name to license plate if name is empty and license plate is provided
      if (name === "licensePlate" && !prev.name && value) {
        updated.name = value;
      }
      // Clear name if license plate is cleared and name was the same as license plate
      if (name === "licensePlate" && !value && prev.name === prev.licensePlate) {
        updated.name = "";
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.year || !formData.make || !formData.model || !formData.vin) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    // Set name to license plate if not provided
    const name = formData.name || formData.licensePlate || null;

    addVehicle({
      name: name || "",
      year: formData.year,
      make: formData.make,
      model: formData.model,
      vin: formData.vin,
      licensePlate: formData.licensePlate,
    });

    showToast("Vehicle added successfully!", "success");
    router.push("/vehicles");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-navy mb-8">Add New Vehicle</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        <div className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Defaults to License Plate"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f04f23] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              placeholder="e.g., 2023"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f04f23] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="make"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Make <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
              placeholder="e.g., Toyota"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f04f23] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="model"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              placeholder="e.g., Camry"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f04f23] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="vin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              VIN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleChange}
              required
              placeholder="Vehicle Identification Number"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f04f23] focus:border-transparent font-mono"
            />
          </div>

          <div>
            <label
              htmlFor="licensePlate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              License Plate <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              placeholder="e.g., ABC-1234"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f04f23] focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-[#f04f23] text-white px-6 py-3 rounded-md hover:bg-[#d43e1a] transition-colors font-medium"
          >
            Add Vehicle
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

