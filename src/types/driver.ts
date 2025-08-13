
export type DriverCheck = {
  id: string;
  driverId: string;
  vehicleId: string;
  depth: {
    mode: "rapide" | "complet" | "multi-positions";
    positions?: { 
        avg?: number|null; 
        avd?: number|null; 
        arg?: number|null; 
        ard?: number|null 
    };
    inner?: number|null;
    center?: number|null;
    outer?: number|null;
    avg: number|null;
    spread: number|null;
  };
  pressure: {
    measuredBar: number|null;
    measuredTemp: "froid"|"chaud";
    normalizedBar: number|null;
    recommendedBar: number;
    diff: number|null;
  };
  score: number;
  status: "OK"|"WARN"|"CRITICAL";
  createdAt: string;
  byDevice?: string;
};
