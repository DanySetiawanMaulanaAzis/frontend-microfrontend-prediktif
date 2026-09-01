import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MachineService } from '../../services/machine';
import { Smartprioritization } from '../../models/smartprioritization';
import { Smartprioritizationsummary } from '../../models/smartprioritizationsummary';


@Component({
  selector: 'app-engineer-smartprioritization',
  imports: [CommonModule, MatSnackBarModule, RouterLink],
  templateUrl: './engineer-smartprioritization.html',
  styleUrl: './engineer-smartprioritization.css',
})
export class EngineerSmartprioritization implements OnInit {
  private machineService = inject(MachineService);
  private snackBar = inject(MatSnackBar);
  
  smartPrioritizations = signal<Smartprioritization[]>([]);
  summary = signal<Smartprioritizationsummary | null>(null);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadSmartPrioritization();
    this.loadSummary();
  }

  loadSmartPrioritization(): void {
    this.isLoading.set(true);
    this.machineService.getCompletedMaintenanceSmartPrioritization().subscribe({
      next: (data) => {
        this.smartPrioritizations.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        this.snackBar.open('Gagal memuat data smart prioritization', 'Tutup', {
          duration: 3000,
        });
      },
    });
  }

  loadSummary(): void {
    this.machineService.getCompletedMaintenanceSummary().subscribe({
      next: (data) => {
        this.summary.set(data);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Gagal memuat data ringkasan', 'Tutup', {
          duration: 3000,
        });
      },
    });
  }
}
