export interface Detailmachine {
  id: number;
  machineId: number;
  machineName: string;
  location: string;
  productionYear: number;
  operationHours: number;
  downtimeHours: number;
  ahs?: number;
  statusId: number;
  statusName: string;
  actionId?: number;
  current7Days?: number;
  last7Days?: number;
  diff7Days?: number;
  current30Days?: number;
  last30Days?: number;
  diff30Days?: number;
  current90Days?: number;
  last90Days?: number;
  diff90Days?: number;
  firstUpdate: string;
  lastUpdate: string;
  daysSinceLastService: number | null;
}