
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
