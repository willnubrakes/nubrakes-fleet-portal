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
  licensePlateState: string;
}

interface VehicleContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  addVehicles: (vehicles: Omit<Vehicle, "id">[]) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

// Initial mock data for demo purposes
const initialVehicles: Vehicle[] = [
  {
    id: "1",
    name: "ABC-1234",
    year: "2022",
    make: "Ford",
    model: "Transit",
    vin: "1FTBR1CM5NKA12345",
    licensePlate: "ABC-1234",
    licensePlateState: "CA",
  },
  {
    id: "2",
    name: "DEF-5678",
    year: "2021",
    make: "Chevrolet",
    model: "Express",
    vin: "1GCVKREC1MZ123456",
    licensePlate: "DEF-5678",
    licensePlateState: "TX",
  },
  {
    id: "3",
    name: "GHI-9012",
    year: "2023",
    make: "Ram",
    model: "ProMaster",
    vin: "3C6TRVAG3NE123456",
    licensePlate: "GHI-9012",
    licensePlateState: "FL",
  },
  {
    id: "4",
    name: "JKL-3456",
    year: "2020",
    make: "Ford",
    model: "F-150",
    vin: "1FTFW1ET5LFC12345",
    licensePlate: "JKL-3456",
    licensePlateState: "NY",
  },
  {
    id: "5",
    name: "MNO-7890",
    year: "2022",
    make: "Toyota",
    model: "Sienna",
    vin: "5TDKZ3DC1NS123456",
    licensePlate: "MNO-7890",
    licensePlateState: "CA",
  },
];

export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);

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

