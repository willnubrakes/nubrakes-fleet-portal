"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useVehicles } from "@/context/VehicleContext";
import { useToast } from "@/components/ToastProvider";
import { SubmitSuccessDialog } from "@/components/SubmitSuccessDialog";
import { ProgressIndicator } from "@/components/ProgressIndicator";

const AVAILABLE_SERVICES = [
  "Brake Pad Replacement",
  "Brake Rotor Replacement",
  "Brake Caliper Replacement",
  "Battery Replacement",
  "Oil Change",
  "Other",
];

const TIME_WINDOWS = ["Morning", "Afternoon", "Anytime"];

const STEPS = [
  "Select Vehicles",
  "Select Services",
  "Preferred Schedule",
];

export default function ServiceRequestPage() {
  const { vehicles } = useVehicles();
  const { showToast } = useToast();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [vehicleServices, setVehicleServices] = useState<Record<string, string[]>>({});
  const [vehicleOtherServices, setVehicleOtherServices] = useState<Record<string, string>>({});
  const [preferredDate, setPreferredDate] = useState<Date | null>(null);
  const [isFlexible, setIsFlexible] = useState(false);
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    vehicles: Array<{
      name: string;
      services: string[];
    }>;
    preferredDate: string;
    preferredTime: string;
    notes: string;
  } | null>(null);

  const handleVehicleToggle = (vehicleId: string) => {
    setSelectedVehicles((prev) => {
      const isCurrentlySelected = prev.includes(vehicleId);
      if (isCurrentlySelected) {
        // Deselecting: clear services for this vehicle
        setVehicleServices((services) => {
          const updated = { ...services };
          delete updated[vehicleId];
          return updated;
        });
        setVehicleOtherServices((others) => {
          const updated = { ...others };
          delete updated[vehicleId];
          return updated;
        });
        return prev.filter((id) => id !== vehicleId);
      } else {
        return [...prev, vehicleId];
      }
    });
  };

  const handleSelectAllVehicles = () => {
    if (selectedVehicles.length === vehicles.length) {
      // Deselecting all: clear all services
      setSelectedVehicles([]);
      setVehicleServices({});
      setVehicleOtherServices({});
    } else {
      setSelectedVehicles(vehicles.map((v) => v.id));
    }
  };

  const handleServiceToggle = (vehicleId: string, service: string) => {
    setVehicleServices((prev) => {
      const vehicleServiceList = prev[vehicleId] || [];
      const isSelected = vehicleServiceList.includes(service);
      
      if (isSelected) {
        if (service === "Other") {
          setVehicleOtherServices((others) => {
            const updated = { ...others };
            delete updated[vehicleId];
            return updated;
          });
        }
        return {
          ...prev,
          [vehicleId]: vehicleServiceList.filter((s) => s !== service),
        };
      } else {
        return {
          ...prev,
          [vehicleId]: [...vehicleServiceList, service],
        };
      }
    });
  };

  const handleSelectAllServicesForVehicle = (vehicleId: string) => {
    const currentServices = vehicleServices[vehicleId] || [];
    if (currentServices.length === AVAILABLE_SERVICES.length) {
      // Deselect all
      setVehicleServices((prev) => {
        const updated = { ...prev };
        delete updated[vehicleId];
        return updated;
      });
      setVehicleOtherServices((others) => {
        const updated = { ...others };
        delete updated[vehicleId];
        return updated;
      });
    } else {
      // Select all
      setVehicleServices((prev) => ({
        ...prev,
        [vehicleId]: [...AVAILABLE_SERVICES],
      }));
    }
  };

  const validateStep1 = (): boolean => {
    if (selectedVehicles.length === 0) {
      showToast("Please select at least one vehicle", "error");
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    // Validate each selected vehicle has at least one service
    for (const vehicleId of selectedVehicles) {
      const services = vehicleServices[vehicleId] || [];
      if (services.length === 0) {
        const vehicle = vehicles.find((v) => v.id === vehicleId);
        const vehicleName = vehicle?.name || vehicle?.vin || "Selected vehicle";
        showToast(`Please select at least one service for ${vehicleName}`, "error");
        return false;
      }

      // Validate "Other" service has text
      if (services.includes("Other")) {
        const otherText = vehicleOtherServices[vehicleId] || "";
        if (!otherText.trim()) {
          const vehicle = vehicles.find((v) => v.id === vehicleId);
          const vehicleName = vehicle?.name || vehicle?.vin || "Selected vehicle";
          showToast(`Please specify the 'Other' service for ${vehicleName}`, "error");
          return false;
        }
      }
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (!isFlexible && !preferredDate) {
      showToast("Please select a preferred date or mark as flexible", "error");
      return false;
    }

    if (!preferredTime) {
      showToast("Please select a preferred time window", "error");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      return;
    }

    setIsSubmitting(true);

    // Prepare payload with services per vehicle
    const vehiclesWithServices = selectedVehicles.map((id) => {
      const vehicle = vehicles.find((v) => v.id === id);
      const services = vehicleServices[id] || [];
      const otherText = vehicleOtherServices[id] || "";
      
      // Map services, replacing "Other" with the actual text
      const servicesList = services.map((service) =>
        service === "Other" ? otherText.trim() : service
      );

      return {
        id: vehicle?.id,
        name: vehicle?.name,
        vin: vehicle?.vin,
        licensePlate: vehicle?.licensePlate,
        licensePlateState: vehicle?.licensePlateState,
        services: servicesList,
      };
    });

    const payload = {
      vehicles: vehiclesWithServices,
      preferredDate: isFlexible ? null : preferredDate?.toISOString().split("T")[0] || null,
      preferredTime,
      notes: notes.trim() || null,
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
        vehicles: vehiclesWithServices.map((v) => ({
          name: v.name || v.vin || "Unknown",
          services: v.services,
        })),
        preferredDate: isFlexible ? "Flexible" : preferredDate?.toLocaleDateString() || "",
        preferredTime,
        notes: notes.trim(),
      });

      setShowSuccessDialog(true);

      // Reset form
      setSelectedVehicles([]);
      setVehicleServices({});
      setVehicleOtherServices({});
      setPreferredDate(null);
      setIsFlexible(false);
      setPreferredTime("");
      setNotes("");
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

      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={STEPS.length}
        stepLabels={STEPS}
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        {/* Step 1: Vehicle Selection */}
        {currentStep === 1 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-navy">
                Select Vehicles <span className="text-red-500">*</span>
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
        )}

        {/* Step 2: Service Selection */}
        {currentStep === 2 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-navy mb-4">
              Select Services <span className="text-red-500">*</span>
            </h2>
            {selectedVehicles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No vehicles selected. Please go back to select vehicles.
              </div>
            ) : (
              <div className="space-y-4">
                {selectedVehicles.map((vehicleId) => {
                  const vehicle = vehicles.find((v) => v.id === vehicleId);
                  if (!vehicle) return null;

                  const vehicleServiceList = vehicleServices[vehicleId] || [];
                  const otherServiceText = vehicleOtherServices[vehicleId] || "";

                  return (
                    <div
                      key={vehicleId}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-navy">
                          {vehicle.name || vehicle.vin}
                          <span className="text-gray-500 text-sm font-normal ml-2">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleSelectAllServicesForVehicle(vehicleId)}
                          className="text-sm text-[#f04f23] hover:underline"
                        >
                          {vehicleServiceList.length === AVAILABLE_SERVICES.length
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                      </div>
                      <div className="space-y-2">
                        {AVAILABLE_SERVICES.map((service) => (
                          <label
                            key={service}
                            className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-white cursor-pointer bg-white"
                          >
                            <input
                              type="checkbox"
                              checked={vehicleServiceList.includes(service)}
                              onChange={() => handleServiceToggle(vehicleId, service)}
                              className="mr-3 h-4 w-4 text-[#f04f23] focus:ring-[#f04f23] border-gray-300 rounded"
                            />
                            <span className="font-medium">{service}</span>
                          </label>
                        ))}
                      </div>
                      {vehicleServiceList.includes("Other") && (
                        <div className="mt-4">
                          <label
                            htmlFor={`other-service-${vehicleId}`}
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Please specify:
                          </label>
                          <input
                            type="text"
                            id={`other-service-${vehicleId}`}
                            value={otherServiceText}
                            onChange={(e) =>
                              setVehicleOtherServices((prev) => ({
                                ...prev,
                                [vehicleId]: e.target.value,
                              }))
                            }
                            placeholder="Enter service description"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f04f23] focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Step 3: Preferred Schedule */}
        {currentStep === 3 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-navy mb-4">
              Preferred Schedule <span className="text-red-500">*</span>
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

            <div className="mb-4">
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

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or special instructions..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#f04f23] focus:border-transparent resize-y"
              />
            </div>
          </section>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Back
            </button>
          )}
          <div className="flex-1" />
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-[#f04f23] text-white rounded-md hover:bg-[#d43e1a] transition-colors font-medium"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#f04f23] text-white rounded-md hover:bg-[#d43e1a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          )}
        </div>
      </form>

      <SubmitSuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          router.push("/");
        }}
        submittedData={submittedData || undefined}
      />
    </div>
  );
}

