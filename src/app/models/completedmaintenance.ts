export interface Completedmaintenance {
  id: number;
  machineId: number;
  machineName: string;
  maintenance: boolean;
  lastUpdate: string | Date;
  machineDetailId: number;
  location: string;
  ahs: number | null
  eventId: number | null;
  event: string | null;
  maintenanceType: string | null;
  actionId: number;
  action: string;
}
