
export interface Vehicle {
  id: string;
  immatriculation: string;
  fleetNumber: string;
  category?: string;
  brand: string;
  model: string;
  dimension: string;
  driveConfig: string;
  motor: string;
  typeSol: string[];
  precoAxle: Record<"1" | "2", number>;
  status: 'ok' | 'attention' | 'urgent';
  lastInspectionDate: string; // "DD/MM/YYYY" format
  activityStatus: 'Actif' | 'Inactif';
}

export type VehicleDetails = Omit<Vehicle, 'id' | 'immatriculation' | 'fleetNumber' | 'status' | 'lastInspectionDate' | 'activityStatus'>;
