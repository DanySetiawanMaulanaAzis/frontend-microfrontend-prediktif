import { Component, inject, input, OnInit, OnDestroy, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineService } from '../../services/machine';
import { Detailmachine } from '../../models/detailmachine';
import { Subscription, interval } from 'rxjs';
import { Createundermaintenancerequest } from '../../models/createundermaintenancerequest';

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

  // Modal QR State
  showQrModal = signal<boolean>(false);
  qrImageUrl = signal<string | null>(null);
  isQrLoading = signal<boolean>(false);
  
  showPreventiveModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);

  // Reference signal dari service
  activeOperationHoursSignal = signal<ReturnType<typeof signal<number>> | null>(null);
  activeDowntimeHoursSignal = signal<ReturnType<typeof signal<number>> | null>(null);

  constructor() {
    // Reactive Fetch: Berjalan setiap kali nilai `id()` berubah
    effect(() => {
      const machineId = Number(this.id());
      if (machineId) {
        this.fetchDetail(machineId);
      }
    });
  }

  private formatSeconds(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  // Live Formatted Signal untuk Jam Operasional
  formattedOperationHours = computed(() => {
    const hoursSignal = this.activeOperationHoursSignal();
    return this.formatSeconds(hoursSignal ? hoursSignal() : 0);
  });

  // Live Formatted Signal untuk Jam Downtime
  formattedDowntimeHours = computed(() => {
    const downtimeSignal = this.activeDowntimeHoursSignal();
    return this.formatSeconds(downtimeSignal ? downtimeSignal() : 0);
  });

  private fetchDetail(id: number): void {
    this.isLoading.set(true);

    this.machineService.getMachineDetailById(id).subscribe({
      next: (data) => {
        this.machineDetail.set(data);

        // Ambil reference signal live Operation Hours
        const liveOpSignal = this.machineService.getOperationHoursSignal(
          data.machineId,
          data.operationHours || 0
        );
        this.activeOperationHoursSignal.set(liveOpSignal);

        // Ambil reference signal live Downtime Hours
        const liveDtSignal = this.machineService.getDowntimeHoursSignal(
          data.machineId,
          data.downtimeHours || 0
        );
        this.activeDowntimeHoursSignal.set(liveDtSignal);

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Gagal mengambil detail mesin', err);
        this.isLoading.set(false);
      },
    });
  }

  // --- Handlers QR Modal ---
  openQrModal(): void {
    this.showQrModal.set(true);
    if (!this.qrImageUrl()) {
      this.isQrLoading.set(true);
      const machineId = Number(this.id());

      this.machineService.getMachineQrCode(machineId).subscribe({
        next: (blob) => {
          const imageUrl = URL.createObjectURL(blob);
          this.qrImageUrl.set(imageUrl);
          this.isQrLoading.set(false);
        },
        error: (err) => {
          console.error('Gagal memuat gambar QR Code:', err);
          this.isQrLoading.set(false);
        },
      });
    }
  }

  closeQrModal(): void {
    this.showQrModal.set(false);
  }

  onCallTechnicianFromEngineer(): void {
    this.showPreventiveModal.set(true);
  }

  submitPreventiveMaintenance(): void {
    const currentMachine = this.machineDetail(); // Menggunakan signal detail mesin komponen Anda
    
    if (!currentMachine) {
      console.error('Data mesin tidak ditemukan.');
      return;
    }

    this.isSubmitting.set(true);

    const payload: Createundermaintenancerequest = {
      machineId: currentMachine.machineId,
      machineName: currentMachine.machineName,
      maintenance: true,
      eventId: 1
    };

    this.machineService.createUnderMaintenance(payload).subscribe({
      next: (res) => {
        console.log('Permintaan Preventive Maintenance berhasil dikirim:', res);
        this.isSubmitting.set(false);
        this.closePreventiveModal();
        
        // Opsional: tambahkan notifikasi sukses atau refresh data detail mesin jika diperlukan
      },
      error: (err) => {
        console.error('Gagal membuat permintaan Preventive Maintenance:', err);
        this.isSubmitting.set(false);
      }
    });
  }

  closePreventiveModal(): void {
    this.showPreventiveModal.set(false);
  }
}
