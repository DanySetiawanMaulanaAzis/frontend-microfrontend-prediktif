export interface Undermaintenance {
  id: number;
  machineId: number;
  machineName: string;
  maintenance: boolean;
  createdAt: string | Date;
  machineDetailId: number;
  location: string;
  ahs?: number;
  eventId: number | null;
  event: string | null;
  maintenanceType: string | null;
  productionYear: number;
  operationHours: number;
  downtimeHours: number;
  statusName: string;
  daysSinceLastService: number | null;
  daysBetweenEvents: number | null;
}
