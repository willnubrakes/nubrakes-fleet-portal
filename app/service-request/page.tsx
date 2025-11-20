"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useVehicles } from "@/context/VehicleContext";
import { useToast } from "@/components/ToastProvider";
import { SubmitSuccessDialog } from "@/components/SubmitSuccessDialog";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { TimeWindowChips } from "@/components/ui/TimeWindowChips";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const AVAILABLE_SERVICES = [
  "Brake Pad Replacement",
  "Brake Rotor Replacement",
  "Brake Caliper Replacement",
  "Battery Replacement",
  "Oil Change",
  "Other",
];

const SERVICE_CATEGORIES = {
  Brakes: ["Brake Pad Replacement", "Brake Rotor Replacement", "Brake Caliper Replacement"],
  "Oil Change": ["Oil Change"],
  Battery: ["Battery Replacement"],
  Other: ["Other"],
};

const TIME_WINDOWS = ["Morning", "Afternoon", "Anytime"];

const STEPS = [
  "Select Vehicles",
  "Select Services",
  "Preferred Schedule",
];

const getServiceIcon = (service: string) => {
  if (service.includes("Brake")) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  if (service.includes("Battery")) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }
  if (service.includes("Oil")) {
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
};

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
  const [searchQuery, setSearchQuery] = useState("");
  const [notesExpanded, setNotesExpanded] = useState(false);
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

  const handleSelectAllVehicles = (filteredVehiclesList?: typeof vehicles) => {
    const vehiclesToUse = filteredVehiclesList || vehicles;
    const filteredIds = vehiclesToUse.map((v) => v.id);
    const allFilteredSelected = filteredIds.every((id) => selectedVehicles.includes(id));
    
    if (allFilteredSelected) {
      // Deselecting filtered vehicles: remove them from selection
      setSelectedVehicles((prev) => prev.filter((id) => !filteredIds.includes(id)));
      // Clear services for deselected vehicles
      setVehicleServices((services) => {
        const updated = { ...services };
        filteredIds.forEach((id) => delete updated[id]);
        return updated;
      });
      setVehicleOtherServices((others) => {
        const updated = { ...others };
        filteredIds.forEach((id) => delete updated[id]);
        return updated;
      });
    } else {
      // Select all filtered vehicles
      setSelectedVehicles((prev) => {
        const newSelection = [...prev];
        filteredIds.forEach((id) => {
          if (!newSelection.includes(id)) {
            newSelection.push(id);
          }
        });
        return newSelection;
      });
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
            className="text-[#F15A29] font-medium hover:underline"
          >
            Add vehicles →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-navy mb-8">Request Service</h1>

      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={STEPS.length}
        stepLabels={STEPS}
      />

      <Card className="relative">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Vehicle Selection */}
          {currentStep === 1 && (() => {
            const filteredVehicles = vehicles.filter((vehicle) => {
              if (!searchQuery.trim()) return true;
              const query = searchQuery.toLowerCase().trim();
              return vehicle.licensePlate?.toLowerCase().includes(query);
            });
            const filteredVehicleIds = filteredVehicles.map((v) => v.id);
            const allFilteredSelected = filteredVehicleIds.length > 0 && filteredVehicleIds.every((id) => selectedVehicles.includes(id));
            
            return (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-navy mb-4">
                  Select Vehicles <span className="text-red-500">*</span>
                </h2>
                <div className="flex gap-3 items-end mb-4">
                  <div>
                    <label
                      htmlFor="license-plate-search"
                      className="block text-sm font-semibold text-gray-600 mb-2"
                    >
                      Search by License Plate
                    </label>
                    <input
                      type="text"
                      id="license-plate-search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter license plate to search..."
                      className="w-48 px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F15A29] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <Link
                      href="/vehicles/new"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors h-11"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Vehicle missing?
                    </Link>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                  {/* Desktop Table */}
                  <div className="hidden md:block table-container" style={{ maxHeight: "500px" }}>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 table-fixed-header">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={allFilteredSelected}
                                  onChange={() => handleSelectAllVehicles(filteredVehicles)}
                                  className="h-4 w-4 text-[#F15A29] focus:ring-[#F15A29] border-gray-300 rounded"
                                />
                                <span>Select All</span>
                              </div>
                            </th>
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
                          {filteredVehicles.map((vehicle, index) => (
                            <tr
                              key={vehicle.id}
                              className={`table-row-hover cursor-pointer ${
                                index % 2 === 1 ? "table-row-alternate" : ""
                              }`}
                              onClick={() => handleVehicleToggle(vehicle.id)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={selectedVehicles.includes(vehicle.id)}
                                  onChange={() => handleVehicleToggle(vehicle.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-4 w-4 text-[#F15A29] focus:ring-[#F15A29] border-gray-300 rounded"
                                />
                              </td>
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
                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3 p-4">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                      <input
                        type="checkbox"
                        checked={allFilteredSelected}
                        onChange={() => handleSelectAllVehicles(filteredVehicles)}
                        className="h-4 w-4 text-[#F15A29] focus:ring-[#F15A29] border-gray-300 rounded"
                      />
                      <span className="text-sm font-semibold text-gray-700">Select All</span>
                    </div>
                    {filteredVehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-shadow ${
                          selectedVehicles.includes(vehicle.id)
                            ? "border-[#F15A29] bg-orange-50"
                            : "border-gray-200 bg-white hover:shadow-md"
                        }`}
                        onClick={() => handleVehicleToggle(vehicle.id)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedVehicles.includes(vehicle.id)}
                            onChange={() => handleVehicleToggle(vehicle.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 mt-1 text-[#F15A29] focus:ring-[#F15A29] border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">
                              {vehicle.name || vehicle.vin}
                            </div>
                            <div className="text-sm text-gray-600">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </div>
                            <div className="text-xs text-gray-500 mt-2 font-mono">
                              VIN: {vehicle.vin}
                            </div>
                            <div className="text-xs text-gray-500">
                              {vehicle.licensePlate} {vehicle.licensePlateState && `(${vehicle.licensePlateState})`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })()}

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
                <div className="space-y-6">
                  {selectedVehicles.map((vehicleId) => {
                    const vehicle = vehicles.find((v) => v.id === vehicleId);
                    if (!vehicle) return null;

                    const vehicleServiceList = vehicleServices[vehicleId] || [];
                    const otherServiceText = vehicleOtherServices[vehicleId] || "";

                    return (
                      <div
                        key={vehicleId}
                        className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-navy text-lg">
                            {vehicle.name || vehicle.vin} — {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleSelectAllServicesForVehicle(vehicleId)}
                            className="text-sm text-[#F15A29] hover:underline"
                          >
                            {vehicleServiceList.length === AVAILABLE_SERVICES.length
                              ? "Deselect All"
                              : "Select All"}
                          </button>
                        </div>
                        <div className="space-y-4">
                          {Object.entries(SERVICE_CATEGORIES).map(([category, services]) => (
                            <div key={category}>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">{category}</h4>
                              <div className="space-y-2">
                                {services.map((service) => (
                                  <label
                                    key={service}
                                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-white cursor-pointer bg-white"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={vehicleServiceList.includes(service)}
                                      onChange={() => handleServiceToggle(vehicleId, service)}
                                      className="mr-3 h-4 w-4 text-[#F15A29] focus:ring-[#F15A29] border-gray-300 rounded"
                                    />
                                    <span className="mr-2 text-gray-600">
                                      {getServiceIcon(service)}
                                    </span>
                                    <span className="font-medium">{service}</span>
                                  </label>
                                ))}
                              </div>
                              {category !== Object.keys(SERVICE_CATEGORIES)[Object.keys(SERVICE_CATEGORIES).length - 1] && (
                                <div className="border-t border-gray-200 my-4"></div>
                              )}
                            </div>
                          ))}
                        </div>
                        {vehicleServiceList.includes("Other") && (
                          <div className="mt-4">
                            <label
                              htmlFor={`other-service-${vehicleId}`}
                              className="block text-sm font-semibold text-gray-600 mb-2"
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
                              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F15A29] focus:border-transparent"
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
            <section className="mb-8 pb-20">
              <h2 className="text-xl font-semibold text-navy mb-4">
                Preferred Schedule <span className="text-red-500">*</span>
              </h2>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isFlexible}
                    onChange={(e) => setIsFlexible(e.target.checked)}
                    className="mr-2 h-4 w-4 text-[#F15A29] focus:ring-[#F15A29] border-gray-300 rounded"
                  />
                  <span className="font-semibold text-gray-600">Flexible on date</span>
                </label>
              </div>

              {!isFlexible && (
                <div className="mb-6">
                  <label
                    htmlFor="preferred-date"
                    className="block text-sm font-semibold text-gray-600 mb-2"
                  >
                    Preferred Date
                  </label>
                  <DatePicker
                    id="preferred-date"
                    selected={preferredDate}
                    onChange={(date: Date | null) => setPreferredDate(date)}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F15A29] focus:border-transparent"
                    placeholderText="Select a date"
                    showPopperArrow={false}
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Preferred Time Window <span className="text-red-500">*</span>
                </label>
                <TimeWindowChips
                  value={preferredTime}
                  onChange={setPreferredTime}
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onFocus={() => setNotesExpanded(true)}
                  placeholder="Add any additional notes or special instructions..."
                  rows={notesExpanded || notes ? 6 : 3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#F15A29] focus:border-transparent resize-y transition-all"
                />
              </div>
            </section>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between pt-4 border-t border-gray-200">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                className="w-full sm:w-auto"
              >
                Back
              </Button>
            )}
            <div className="flex-1 hidden sm:block" />
            {currentStep < 3 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full sm:w-auto sticky bottom-4 sm:static"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            )}
          </div>
        </form>
      </Card>

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
