export interface Undermaintenance {
  id: number;
  machineId: number;
  machineName: string;
  maintenance: boolean;
  createdAt: string | Date;
  machineDetailId: number;
  location: string;
  ahs?: number;
}
