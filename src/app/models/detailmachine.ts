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
  last7Days?: number;
  last30Days?: number;
  last90Days?: number;
  firstUpdate: string;
  lastUpdate: string;
  
  // Property selisih dari backend
  diff7Days?: number;
  diff30Days?: number;
  diff90Days?: number;
}