export interface Machine {
  id: number;
  machineName: string;
  location: string;
  productionYear: number;
  qrCode?: string | null; // String Base64 dari PNG
  createdAt: string;
}
