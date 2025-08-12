
import type { Vehicle } from './vehicle';

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

// --- Types for Tyre Inspection v2 ---

export type TyreDepth = {
  inner: number | null;
  center: number | null;
  outer: number | null;
  avg: number | null;
  min: number | null;
  max: number | null;
  spread: number | null;
  std: number | null;
  qualityScore: number | null;
};

export type TyrePressure = {
  measuredBar: number | null;
  recommendedBar: number;
  correctedBar: number | null;
};

export type MeasureMeta = {
  tool: "pige digitale" | "pige mécanique" | "autre";
  photoIds?: string[];
  byUserId?: string;
  side: "gauche" | "droite";
  timestamp: string; // ISO
};

export type TyreInspectionPayload = {
  position: "1L" | "1R" | "2L" | "2R";
  depth: TyreDepth;
  pressure: TyrePressure;
  measureMeta: MeasureMeta;
  status: "completed";
  inspectedAt: string; // ISO
  version: 2;
};

export type InspectionData = {
  '1L'?: TyreInspectionPayload;
  '1R'?: TyreInspectionPayload;
  '2L'?: TyreInspectionPayload;
  '2R'?: TyreInspectionPayload;
};
