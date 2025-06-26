
export interface Tire {
  id: string;
  name: string;
  vehicle: string;
  site: string;
  currentMileage: number;
  pressure: number; // in PSI
  treadDepth: number; // in mm
  status: 'active' | 'warning' | 'critical' | 'maintenance';
  lastInspection: string; // ISO date string
}

export interface Alert {
  id: string;
  tireId: string;
  tireName: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string; // ISO date string
}

export interface PerformanceMetric {
  month: string;
  mileage: number;
  wearRate: number; // mm per 1000 miles for example
}

export interface RemplissageFormData {
  site: string;
  numeroInterne: string;
  heure2024: number;
  heure2025: number;
  dimension: string;
  profilActuel: string;
  position: string;
  heuresRealisees: number;
  echeanceHoraire: number;
  projectionFinal: number;
  echeanceMois: number;
  quantite: number;
  profilRecommande: string;
  dateChangement: string; // format : YYYY-MM
  commentaires?: string;
}

// --- Types for the new dashboard ---
export interface MockTire {
    id: string;
    vehicle: string;
    site: string;
    status: 'ok' | 'surveillance' | 'critique';
    wear: number; // in mm
    cost_h: number; // cost per hour
    cost_mm: number; // cost per mm of wear
    brand: string;
}

export interface MockPerformanceDataItem {
    name: string;
    'Coût/h (€)': number;
    'Durée de vie (h)': number;
    'Score': '🥇' | '🥈' | '🥉' | string;
}

export interface MockPredictiveDataItem {
    name: string; // Month or time period
    usure: number; // Wear in mm
}

export interface Vehicle {
  id: string;
  immatriculation: string;
  fleetNumber: string;
  context: string;
  mileage?: number;
  hours?: number;
  status: 'ok' | 'attention' | 'urgent';
  lastInspectionDate: string; // "DD/MM/YYYY" format
  activityStatus: 'Actif' | 'Inactif';
}
