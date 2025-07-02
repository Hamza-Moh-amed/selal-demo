import { ReactNode } from "react";

export interface Boat {
  id: string;
  name: string;
  registrationNumber: string;
  captainName: string;
  capacity: number;
  boxSize: "20kg" | "25kg";
  status: "active" | "maintenance" | "retired";
  photo: string;
  lastMaintenanceDate: string;
  currentUtilization?: number;
  totalBoxesUsed?: number;
  timeSlots?: string[];
  availableCapacity?: number;
}

export interface BoxRequest {
  boatId: string;
  boxType: "medium" | "large";
  quantity: number;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  specialInstructions: string;
}

export interface EditBoatFormProps {
  boat: Boat;
  onClose: () => void;
}

export interface SummaryCardType {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  iconBgClass?: string;
  valueClass?: string;
}

export interface SummaryCardsProps {
  summaryCards: SummaryCardType[];
}

export interface BoatListProps {
  boats: Boat[];
  editingBoat: Boat | null;
  handleEditBoat: (boat: Boat) => void;
  setIsEditBoatModalOpen: (open: boolean) => void;
  getStatusColor: (status: string) => string;
  getUtilizationColor: (utilization: number) => string;
}
