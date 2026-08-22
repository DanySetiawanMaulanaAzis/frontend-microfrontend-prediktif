import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MachineService } from '../../services/machine';
import { Undermaintenance } from '../../models/undermaintenance';

@Component({
  selector: 'app-technician-dashboard',
  imports: [DatePipe],
  templateUrl: './technician-dashboard.html',
  styleUrl: './technician-dashboard.css',
})
export class TechnicianDashboard implements OnInit {
  private machineService = inject(MachineService);
  private router = inject(Router);

  // Signal untuk menyimpan data list jadwal mesin
  schedules = signal<Undermaintenance[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchSchedules();
  }

  fetchSchedules(): void {
    this.isLoading.set(true);
    this.machineService.getUnderMaintenance().subscribe({
      next: (data) => {
        this.schedules.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching maintenance schedule:', err);
        this.errorMessage.set('Gagal memuat data jadwal mesin.');
        this.isLoading.set(false);
      }
    });
  }

  // 3. Fungsi Navigasi ke Detail Mesin
  onSelectMachine(machineDetailId: number): void {
    this.router.navigate(['/technician', machineDetailId]);
  }
}
