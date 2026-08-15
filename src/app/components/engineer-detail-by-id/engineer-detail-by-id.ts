import { Component, inject, input, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineService } from '../../services/machine';
import { Detailmachine } from '../../models/detailmachine';

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

  constructor() {
    // Reactive Fetch: Berjalan setiap kali nilai `id()` berubah
    effect(() => {
      const machineId = Number(this.id());
      if (machineId) {
        this.fetchDetail(machineId);
      }
    });
  }

  private fetchDetail(id: number): void {
    this.isLoading.set(true);
    this.machineService.getMachineDetailById(id).subscribe({
      next: (data) => {
        this.machineDetail.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Gagal mengambil detail mesin', err);
        this.isLoading.set(false);
      }
    });
  }
}
