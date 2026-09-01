export interface Smartprioritization {
  id: number;
  machineId: number;
  machineName: string;
  lastUpdate: string; // Tipe ISO DateString dari backend (JSON response)
  ahs: number | null;
  userId: number | null;
  userName: string | null;
  actionId: number | null;
  action: string | null;
  has30DaysHistory: boolean;
  current30Days: number | null;
  last30Days: number | null;
  diff30Days: number | null;
}
