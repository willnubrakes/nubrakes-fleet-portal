"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useVehicles } from "@/context/VehicleContext";
import { useToast } from "@/components/ToastProvider";
import { SubmitSuccessDialog } from "@/components/SubmitSuccessDialog";

const AVAILABLE_SERVICES = [
  "Brake Pad Replacement",
  "Brake Rotor Replacement",
  "Brake Caliper Replacement",
  "Battery Replacement",
  "Oil Change",
  "Other",
];

const TIME_WINDOWS = ["Morning", "Afternoon", "Anytime"];

export default function ServiceRequestPage() {
  const { vehicles } = useVehicles();
  const { showToast } = useToast();

  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [otherServiceText, setOtherServiceText] = useState("");
  const [preferredDate, setPreferredDate] = useState<Date | null>(null);
  const [isFlexible, setIsFlexible] = useState(false);
  const [preferredTime, setPreferredTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    vehicles: string[];
    services: string[];
    preferredDate: string;
    preferredTime: string;
  } | null>(null);

  const handleVehicleToggle = (vehicleId: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const handleSelectAllVehicles = () => {
    if (selectedVehicles.length === vehicles.length) {
      setSelectedVehicles([]);
    } else {
      setSelectedVehicles(vehicles.map((v) => v.id));
    }
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(service)) {
        if (service === "Other") {
          setOtherServiceText("");
        }
        return prev.filter((s) => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (selectedVehicles.length === 0) {
      showToast("Please select at least one vehicle", "error");
      return;
    }

    if (selectedServices.length === 0) {
      showToast("Please select at least one service", "error");
      return;
    }

    if (selectedServices.includes("Other") && !otherServiceText.trim()) {
      showToast("Please specify the 'Other' service", "error");
      return;
    }

    if (!isFlexible && !preferredDate) {
      showToast("Please select a preferred date or mark as flexible", "error");
      return;
    }

    if (!preferredTime) {
      showToast("Please select a preferred time window", "error");
      return;
    }

    setIsSubmitting(true);

    // Prepare services list
    const servicesList = selectedServices.map((service) =>
      service === "Other" ? otherServiceText.trim() : service
    );

    // Get vehicle names
    const vehicleNames = selectedVehicles.map((id) => {
      const vehicle = vehicles.find((v) => v.id === id);
      return vehicle?.name || vehicle?.vin || id;
    });

    const payload = {
      vehicles: selectedVehicles.map((id) => {
        const vehicle = vehicles.find((v) => v.id === id);
        return {
          id: vehicle?.id,
          name: vehicle?.name,
          vin: vehicle?.vin,
          licensePlate: vehicle?.licensePlate,
          licensePlateState: vehicle?.licensePlateState,
        };
      }),
      services: servicesList,
      preferredDate: isFlexible ? null : preferredDate?.toISOString().split("T")[0] || null,
      preferredTime,
      submittedAt: new Date().toISOString(),
    };

    try {
      // In static deployment (GitHub Pages), API routes don't work
      // Log to console for demo purposes
      // In production, you'd point this to your actual webhook URL
      const isStatic = typeof window !== "undefined" && window.location.hostname.includes("github.io");
      
      if (isStatic) {
        // For static deployment, just log the payload
        console.log("Service Request Payload (would send to webhook):", payload);
        // In a real scenario, you'd fetch to an external webhook URL here
        // await fetch("https://your-zapier-webhook-url.com", { ... });
      } else {
        // In development, use the API route
        const response = await fetch("/api/webhook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to submit request");
        }
      }

      setSubmittedData({
        vehicles: vehicleNames,
        services: servicesList,
        preferredDate: isFlexible ? "Flexible" : preferredDate?.toLocaleDateString() || "",
        preferredTime,
      });

      setShowSuccessDialog(true);

      // Reset form
      setSelectedVehicles([]);
      setSelectedServices([]);
      setOtherServiceText("");
      setPreferredDate(null);
      setIsFlexible(false);
      setPreferredTime("");
    } catch (error) {
      showToast("Failed to submit request. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            No vehicles in your roster. Please add vehicles before requesting service.
          </p>
          <a
            href="/vehicles/new"
            className="text-[#f04f23] font-medium hover:underline"
          >
            Add vehicles →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-navy mb-8">Request Service</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        {/* Vehicle Selection */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-navy">
              1. Select Vehicles <span className="text-red-500">*</span>
            </h2>
            <button
              type="button"
              onClick={handleSelectAllVehicles}
              className="text-sm text-[#f04f23] hover:underline"
            >
              {selectedVehicles.length === vehicles.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
            {vehicles.map((vehicle) => (
              <label
                key={vehicle.id}
                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedVehicles.includes(vehicle.id)}
                  onChange={() => handleVehicleToggle(vehicle.id)}
                  className="mr-3 h-4 w-4 text-[#f04f23] focus:ring-[#f04f23] border-gray-300 rounded"
                />
                <div>
                  <span className="font-medium">
                    {vehicle.name || vehicle.vin}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Service Selection */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-navy mb-4">
            2. Select Services <span className="text-red-500">*</span>
          </h2>
          <div className="space-y-2">
            {AVAILABLE_SERVICES.map((service) => (
              <label
                key={service}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="mr-3 h-4 w-4 text-[#f04f23] focus:ring-[#f04f23] border-gray-300 rounded"
                />
                <span className="font-medium">{service}</span>
              </label>
            ))}
          </div>
          {selectedServices.includes("Other") && (
            <div className="mt-4">
              <label
                htmlFor="other-service"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Please specify:
              </label>
              <input
                type="text"
                id="other-service"
                value={otherServiceText}
                onChange={(e) => setOtherServiceText(e.target.value)}
                placeholder="Enter service description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f04f23] focus:border-transparent"
              />
            </div>
          )}
        </section>

        {/* Preferred Schedule */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-navy mb-4">
            3. Preferred Schedule <span className="text-red-500">*</span>
          </h2>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isFlexible}
                onChange={(e) => setIsFlexible(e.target.checked)}
                className="mr-2 h-4 w-4 text-[#f04f23] focus:ring-[#f04f23] border-gray-300 rounded"
              />
              <span className="font-medium">Flexible on date</span>
            </label>
          </div>

          {!isFlexible && (
            <div className="mb-4">
              <label
                htmlFor="preferred-date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Preferred Date
              </label>
              <DatePicker
                id="preferred-date"
                selected={preferredDate}
                onChange={(date: Date | null) => setPreferredDate(date)}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f04f23] focus:border-transparent"
                placeholderText="Select a date"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="preferred-time"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Preferred Time Window <span className="text-red-500">*</span>
            </label>
            <select
              id="preferred-time"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f04f23] focus:border-transparent"
            >
              <option value="">Select time window</option>
              {TIME_WINDOWS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#f04f23] text-white px-6 py-3 rounded-md hover:bg-[#d43e1a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>

      <SubmitSuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        submittedData={submittedData || undefined}
      />
    </div>
  );
}

