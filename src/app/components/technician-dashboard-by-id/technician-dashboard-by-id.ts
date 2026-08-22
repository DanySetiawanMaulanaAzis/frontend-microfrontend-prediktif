import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MachineService } from '../../services/machine';
import { Detailmachine } from '../../models/detailmachine';

@Component({
  selector: 'app-technician-dashboard-by-id',
  imports: [RouterLink],
  templateUrl: './technician-dashboard-by-id.html',
  styleUrl: './technician-dashboard-by-id.css',
})
export class TechnicianDashboardById implements OnInit {
  private route = inject(ActivatedRoute);
  private machineService = inject(MachineService);

  machineDetail = signal<Detailmachine | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  activeOperationHoursSignal = signal<ReturnType<typeof signal<number>> | null>(null);
  activeDowntimeHoursSignal = signal<ReturnType<typeof signal<number>> | null>(null);

  // Fungsi pembantu untuk mengonversi total detik ke format HH:mm:ss
  private formatSeconds(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  // Live Formatted Signal untuk Jam Operasi
  formattedOperationHours = computed(() => {
    const hoursSignal = this.activeOperationHoursSignal();
    return this.formatSeconds(hoursSignal ? hoursSignal() : 0);
  });

  // Live Formatted Signal untuk Jam Downtime
  formattedDowntimeHours = computed(() => {
    const downtimeSignal = this.activeDowntimeHoursSignal();
    return this.formatSeconds(downtimeSignal ? downtimeSignal() : 0);
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.fetchMachineDetail(Number(idParam));
    } else {
      this.errorMessage.set('ID Mesin tidak ditemukan.');
      this.isLoading.set(false);
    }
  }

  fetchMachineDetail(id: number): void {
    this.isLoading.set(true);
    this.machineService.getMachineDetailById(id).subscribe({
      next: (data) => {
        this.machineDetail.set(data);

        // Ambil reference signal live Operation Hours dari service
        const liveOpSignal = this.machineService.getOperationHoursSignal(
          data.machineId,
          data.operationHours || 0
        );
        this.activeOperationHoursSignal.set(liveOpSignal);

        // Ambil reference signal live Downtime Hours dari service
        const liveDtSignal = this.machineService.getDowntimeHoursSignal(
          data.machineId,
          data.downtimeHours || 0
        );
        this.activeDowntimeHoursSignal.set(liveDtSignal);

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching machine detail:', err);
        this.errorMessage.set('Gagal memuat detail mesin.');
        this.isLoading.set(false);
      }
    });
  }
}
