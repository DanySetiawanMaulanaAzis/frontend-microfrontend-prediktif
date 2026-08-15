import { Component, inject, input, OnInit, OnDestroy, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineService } from '../../services/machine';
import { Detailmachine } from '../../models/detailmachine';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-engineer-detail-by-id',
  imports: [CommonModule],
  templateUrl: './engineer-detail-by-id.html',
  styleUrl: './engineer-detail-by-id.css',
})
export class EngineerDetailById {
  private machineService = inject(MachineService);

  id = input.required<number>();
  machineDetail = signal<Detailmachine | null>(null)
  isLoading = signal<boolean>(false);
  
  // Reference signal dari service
  activeOperationHoursSignal = signal<ReturnType<typeof signal<number>> | null>(null);

  constructor() {
    // Reactive Fetch: Berjalan setiap kali nilai `id()` berubah
    effect(() => {
      const machineId = Number(this.id());
      if (machineId) {
        this.fetchDetail(machineId);
      }
    });
  }

  // Formatting detik ke hh:mm:ss
  formattedOperationHours = computed(() => {
    const hoursSignal = this.activeOperationHoursSignal();
    const total = hoursSignal ? hoursSignal() : 0;

    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  });

  private fetchDetail(id: number): void {
    this.isLoading.set(true);

    this.machineService.getMachineDetailById(id).subscribe({
      next: (data) => {
        this.machineDetail.set(data);
        
        // Ambil reference signal live dari service
        const liveSignal = this.machineService.getOperationHoursSignal(
          data.machineId, 
          data.operationHours || 0
        );
        this.activeOperationHoursSignal.set(liveSignal);
        
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Gagal mengambil detail mesin', err);
        this.isLoading.set(false);
      }
    });
  }
}
