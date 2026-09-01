import { Component, inject, input, OnInit, OnDestroy, signal, effect, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MachineService } from '../../services/machine';
import { Detailmachine } from '../../models/detailmachine';
import { Completedmaintenance } from '../../models/completedmaintenance';
import { Subscription, interval } from 'rxjs';
import { Createundermaintenancerequest } from '../../models/createundermaintenancerequest';

@Component({
  selector: 'app-engineer-detail-by-id',
  imports: [CommonModule, DatePipe],
  templateUrl: './engineer-detail-by-id.html',
  styleUrl: './engineer-detail-by-id.css',
})
export class EngineerDetailById {
  private machineService = inject(MachineService);

  id = input.required<number>();
  machineDetail = signal<Detailmachine | null>(null)
  completedList = signal<Completedmaintenance[]>([]);
  isLoading = signal<boolean>(false);

  // --- Pagination State ---
  currentPage = signal<number>(1);
  pageSize = signal<number>(3); // Batas 3 item per halaman

  // Total Halaman
  totalPages = computed(() => {
    return Math.ceil(this.completedList().length / this.pageSize()) || 1;
  });

  // Signal berisi 3 item terpotong untuk ditampilkan di halaman aktif
  paginatedCompletedList = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return this.completedList().slice(startIndex, startIndex + this.pageSize());
  });

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

  // --- Navigasi Pagination ---
  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
    }
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
    this.machineService.getCompletedMaintenanceById(id).subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data : [data];
        this.completedList.set(list);
        this.currentPage.set(1);
      },
      error: (err) => {
        console.error('Gagal mengambil completed maintenance', err);
      }
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

  getAhsChangeText(item: Completedmaintenance): string {
    const list = this.completedList();
    const originalIndex = list.indexOf(item);
    if (originalIndex === -1) return '-';

    const currentItem = list[originalIndex];
    const previousItem = list[originalIndex + 1];

    const currentAhs = currentItem?.ahs;
    const previousAhs = previousItem?.ahs;

    if (currentAhs === null || currentAhs === undefined) {
      return '-';
    }

    const formattedCurrent = `${currentAhs}%`;

    if (previousAhs === null || previousAhs === undefined) {
      return formattedCurrent;
    }

    return `${previousAhs}% \u2192 ${formattedCurrent}`;
  }

  getAhsScoreClass(item: Completedmaintenance): string {
    const currentAhs = item?.ahs;

    if (currentAhs === null || currentAhs === undefined) {
      return 'score-empty';
    }

    if (currentAhs >= 80) {
      return 'score-routine';
    } else if (currentAhs >= 60) {
      return 'score-major';
    } else if (currentAhs >= 40) {
      return 'score-minor';
    } else {
      return 'score-critical';
    }
  }

  // Format teks diff langsung menggunakan angka bulat dari backend
  getFormattedDiff(diff: number | null | undefined): string {
    if (diff === null || diff === undefined) return '0%';
    return `${diff > 0 ? '+' : ''}${diff}%`;
  }

  // Menentukan class CSS berdasarkan positif/negatif
  getDiffClass(diff: number | null | undefined): string {
    if (diff === null || diff === undefined) return 'neutral';
    return diff >= 0 ? 'positive' : 'negative';
  }
}
