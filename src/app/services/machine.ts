import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Observable, tap } from 'rxjs';
import { Machine } from '../models/machine';
import { Createandupdatemachinerequest } from '../models/createandupdatemachinerequest';
import { Detailmachine } from '../models/detailmachine';
import { Createundermaintenancerequest } from '../models/createundermaintenancerequest';
import { Undermaintenance } from '../models/undermaintenance';
import { Updateundermaintenancestatusrequest } from '../models/updateundermaintenancestatusrequest';
import { Completedmaintenance } from '../models/completedmaintenance';
import { Machinepredictresponse } from '../models/machinepredictresponse';
import { Smartprioritization } from '../models/smartprioritization';
import { Smartprioritizationsummary } from '../models/smartprioritizationsummary';

@Injectable({
  providedIn: 'root',
})
export class MachineService {
  private http = inject(HttpClient);
  // Endpoint mengarah ke api/Machine sesuai atribut [Route("api/[controller]")] di .NET
  private apiUrl = environment.apiUrl;

  // Track Operation Hours
  private operationHoursMap = new Map<number, ReturnType<typeof signal<number>>>();
  private operationBufferMap = new Map<number, number>();

  // Track Downtime Hours
  private downtimeHoursMap = new Map<number, ReturnType<typeof signal<number>>>();
  private downtimeBufferMap = new Map<number, number>();

  // Set untuk menyimpan daftar machineId yang sedang maintenance (maintenance === true)
  private maintenanceSet = new Set<number>();
  private globalTimerStarted = false;

  constructor() {
    this.startGlobalTimer();
  }

  // Polling data status undermaintenance dari backend
  private refreshMaintenanceStatus(): void {
    this.getUnderMaintenance().subscribe({
      next: (list) => {
        this.maintenanceSet.clear();
        list.forEach((item) => {
          // Jika maintenance = true, masukkan ke daftar blokir timer
          if (item.maintenance) {
            this.maintenanceSet.add(item.machineId);
          }
        });
      },
      error: (err) => console.error('Gagal memperbarui status maintenance:', err),
    });
  }

  // Timer global 1 detik
  private startGlobalTimer(): void {
    if (this.globalTimerStarted) return;
    this.globalTimerStarted = true;

    this.refreshMaintenanceStatus();
    setInterval(() => this.refreshMaintenanceStatus(), 5000);

    setInterval(() => {
      // 1. DOWNTIME TIMER: Berjalan untuk mesin yang Maintenance = TRUE
      this.downtimeHoursMap.forEach((downtimeSignal, machineId) => {
        if (this.maintenanceSet.has(machineId)) {
          // Increment detik Downtime
          downtimeSignal.update((sec) => sec + 1);

          const currentBuffer = (this.downtimeBufferMap.get(machineId) || 0) + 1;
          this.downtimeBufferMap.set(machineId, currentBuffer);

          // Sync ke Backend tiap 5 detik
          if (currentBuffer >= 5) {
            this.downtimeBufferMap.set(machineId, 0);
            this.syncDowntimeHoursToBackend(machineId, currentBuffer);
          }
        }
      });

      // 2. OPERATION TIMER: Berjalan untuk mesin yang Maintenance = FALSE
      this.operationHoursMap.forEach((hoursSignal, machineId) => {
        if (!this.maintenanceSet.has(machineId)) {
          // Increment detik Operation
          hoursSignal.update((sec) => sec + 1);

          const currentBuffer = (this.operationBufferMap.get(machineId) || 0) + 1;
          this.operationBufferMap.set(machineId, currentBuffer);

          // Sync ke Backend tiap 5 detik
          if (currentBuffer >= 5) {
            this.operationBufferMap.set(machineId, 0);
            this.syncOperationHoursToBackend(machineId, currentBuffer);
          }
        }
      });
    }, 1000);
  }

  private syncOperationHoursToBackend(machineId: number, secondsToAdd: number): void {
    this.updateOperationHours(machineId, secondsToAdd).subscribe({
      error: (err) => console.error(`Gagal update operation hours untuk machine ${machineId}:`, err),
    });
  }

  private syncDowntimeHoursToBackend(machineId: number, secondsToAdd: number): void {
    this.updateDowntimeHours(machineId, secondsToAdd).subscribe({
      error: (err) => console.error(`Gagal update downtime hours machine ${machineId}:`, err),
    });
  }

  // Ambil atau inisialisasi Signal Operation Hours untuk mesin tertentu
  getOperationHoursSignal(machineId: number, initialSeconds: number) {
    if (!this.operationHoursMap.has(machineId)) {
      this.operationHoursMap.set(machineId, signal<number>(initialSeconds));
    } else {
      const existingSignal = this.operationHoursMap.get(machineId)!;
      if (existingSignal() === 0 && initialSeconds > 0) {
        existingSignal.set(initialSeconds);
      }
    }
    return this.operationHoursMap.get(machineId)!;
  }

  getDowntimeHoursSignal(machineId: number, initialSeconds: number) {
    if (!this.downtimeHoursMap.has(machineId)) {
      this.downtimeHoursMap.set(machineId, signal<number>(initialSeconds));
    } else {
      const existingSignal = this.downtimeHoursMap.get(machineId)!;
      if (existingSignal() === 0 && initialSeconds > 0) {
        existingSignal.set(initialSeconds);
      }
    }
    return this.downtimeHoursMap.get(machineId)!;
  }


  // --- REST API ENDPOINTS ---

  // GET: api/Machine
  getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(`${this.apiUrl}/Machine`);
  }

  // GET: api/Machine/{id}
  getMachineById(id: number): Observable<Machine> {
    return this.http.get<Machine>(`${this.apiUrl}/Machine/${id}`);
  }

  // POST: api/Machine
  createMachine(machineData: Createandupdatemachinerequest): Observable<Machine> {
    return this.http.post<Machine>(`${this.apiUrl}/Machine`, machineData);
  }

  // PUT: api/Machine/{id}
  updateMachine(id: number, machineData: Machine): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Machine/${id}`, machineData);
  }

  // DELETE: api/Machine/{id}
  deleteMachine(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Machine/${id}`);
  }

  // GET: api/Machine/details
  getMachineDetails(): Observable<Detailmachine[]> {
    return this.http.get<Detailmachine[]>(`${this.apiUrl}/Machine/details`).pipe(
      tap((details) => {
        // Daftarkan semua mesin ke tracking background sekaligus
        details.forEach(item => {
          this.getOperationHoursSignal(item.machineId, item.operationHours || 0);
        });
      })
    );
  }

  // GET: api/Machine/details/{id}
  getMachineDetailById(id: number): Observable<Detailmachine> {
    return this.http.get<Detailmachine>(`${this.apiUrl}/Machine/details/${id}`).pipe(
      tap((detail) => {
        if (detail) {
          this.getOperationHoursSignal(detail.machineId, detail.operationHours || 0);
        }
      })
    );
  }

  // Tambahkan endpoint update operation hours
  updateOperationHours(machineId: number, secondsToAdd: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/Machine/operation-hours`, {
      machineId,
      secondsToAdd
    });
  }

  updateDowntimeHours(machineId: number, secondsToAdd: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/Machine/downtime-hours`, {
      machineId,
      secondsToAdd
    });
  }

  // GET: api/Machine/qr-code/{id}
  getMachineQrCode(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/Machine/qr-code/${id}`, {
      responseType: 'blob',
    });
  }

  // POST: api/Machine/under-maintenance
  createUnderMaintenance(data: Createundermaintenancerequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/Machine/under-maintenance`, data);
  }

  // PUT: api/Machine/undermaintenance/complete/{id}
  completeUnderMaintenance(id: number, data: Updateundermaintenancestatusrequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/Machine/under-maintenance/complete/${id}`, data);
  }

  // GET: api/Machine/under-maintenance
  getUnderMaintenance(): Observable<Undermaintenance[]> {
    return this.http.get<Undermaintenance[]>(`${this.apiUrl}/Machine/under-maintenance`);
  }

  // Method baru untuk mengambil Completed Maintenance berdasarkan ID
  getCompletedMaintenanceById(id: number): Observable<Completedmaintenance> {
    return this.http.get<Completedmaintenance>(`${this.apiUrl}/Machine/completed-maintenance/machine-detail/history/${id}`);
  }

  // GET: api/Machine/under-maintenance/{id}
  getUnderMaintenanceById(id: number): Observable<Undermaintenance> {
    return this.http.get<Undermaintenance>(`${this.apiUrl}/Machine/under-maintenance/${id}`);
  }

  // GET: api/Machine/predict/{machineDetailId}
  getMachinePrediction(machineDetailId: number): Observable<Machinepredictresponse> {
    return this.http.get<Machinepredictresponse>(`${this.apiUrl}/Machine/predict/${machineDetailId}`);
  }

  // GET: api/Machine/completed-maintenance/history/smart-prioritization
  getCompletedMaintenanceSmartPrioritization(): Observable<Smartprioritization[]> {
    return this.http.get<Smartprioritization[]>(`${this.apiUrl}/Machine/completed-maintenance/history/smart-prioritization`);
  }

  // GET: api/Machine/completed-maintenance/machine-detail/history/smart-prioritization/summary
  getCompletedMaintenanceSummary(): Observable<Smartprioritizationsummary> {
    return this.http.get<Smartprioritizationsummary>(`${this.apiUrl}/Machine/completed-maintenance/machine-detail/history/smart-prioritization/summary`);
  }
}
