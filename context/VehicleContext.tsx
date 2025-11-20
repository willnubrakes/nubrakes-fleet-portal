"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface Vehicle {
  id: string;
  name: string;
  year: string;
  make: string;
  model: string;
  vin: string;
  licensePlate: string;
}

interface VehicleContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  addVehicles: (vehicles: Omit<Vehicle, "id">[]) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const addVehicle = useCallback((vehicle: Omit<Vehicle, "id">) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Math.random().toString(36).substring(7),
    };
    setVehicles((prev) => [...prev, newVehicle]);
  }, []);

  const addVehicles = useCallback((newVehicles: Omit<Vehicle, "id">[]) => {
    const vehiclesWithIds: Vehicle[] = newVehicles.map((vehicle) => ({
      ...vehicle,
      id: Math.random().toString(36).substring(7),
    }));
    setVehicles((prev) => [...prev, ...vehiclesWithIds]);
  }, []);

  const updateVehicle = useCallback(
    (id: string, updates: Partial<Vehicle>) => {
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id === id ? { ...vehicle, ...updates } : vehicle
        )
      );
    },
    []
  );

  const deleteVehicle = useCallback((id: string) => {
    setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
  }, []);

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        addVehicle,
        addVehicles,
        updateVehicle,
        deleteVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error("useVehicles must be used within VehicleProvider");
  }
  return context;
}

