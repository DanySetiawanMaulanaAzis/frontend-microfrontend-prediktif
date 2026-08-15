import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Observable, tap } from 'rxjs';
import { Machine } from '../models/machine';
import { Createandupdatemachinerequest } from '../models/createandupdatemachinerequest';
import { Detailmachine } from '../models/detailmachine';

@Injectable({
  providedIn: 'root',
})
export class MachineService {
  private http = inject(HttpClient);
  // Endpoint mengarah ke api/Machine sesuai atribut [Route("api/[controller]")] di .NET
  private apiUrl = environment.apiUrl;

  // Map untuk menyimpan signal jam operasional tiap mesin: Key = MachineId, Value = Signal<number>
  private operationHoursMap = new Map<number, ReturnType<typeof signal<number>>>();
  private secondsBufferMap = new Map<number, number>();
  private globalTimerStarted = false;

  constructor() {
    this.startGlobalTimer();
  }

  // Timer global 1 detik untuk memutar semua mesin yang terdaftar
  private startGlobalTimer(): void {
    if (this.globalTimerStarted) return;
    this.globalTimerStarted = true;

    setInterval(() => {
      this.operationHoursMap.forEach((hoursSignal, machineId) => {
        // Increment detik di client
        hoursSignal.update(sec => sec + 1);

        // Buffer untuk sync backend tiap 5 detik
        const currentBuffer = (this.secondsBufferMap.get(machineId) || 0) + 1;
        this.secondsBufferMap.set(machineId, currentBuffer);

        if (currentBuffer >= 5) {
          this.secondsBufferMap.set(machineId, 0);
          this.syncOperationHoursToBackend(machineId, currentBuffer);
        }
      });
    }, 1000);
  }

  private syncOperationHoursToBackend(machineId: number, secondsToAdd: number): void {
    this.updateOperationHours(machineId, secondsToAdd).subscribe({
      error: (err) => console.error(`Gagal update operation hours untuk machine ${machineId}:`, err)
    });
  }

  // Ambil atau inisialisasi Signal Operation Hours untuk mesin tertentu
  getOperationHoursSignal(machineId: number, initialSeconds: number) {
    if (!this.operationHoursMap.has(machineId)) {
      this.operationHoursMap.set(machineId, signal<number>(initialSeconds));
    } else {
      // Jika sudah ada tapi bernilai 0/baru, sinkronkan dengan data backend terkini
      const existingSignal = this.operationHoursMap.get(machineId)!;
      if (existingSignal() === 0 && initialSeconds > 0) {
        existingSignal.set(initialSeconds);
      }
    }
    return this.operationHoursMap.get(machineId)!;
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
}
