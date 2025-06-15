
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

// Nouveau type pour les données du formulaire de remplissage
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
