import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MachineService } from '../../services/machine';
import { Detailmachine } from '../../models/detailmachine';


@Component({
  selector: 'app-operator-dashboard-selected-machine',
  imports: [CommonModule, FormsModule],
  templateUrl: './operator-dashboard-selected-machine.html',
  styleUrl: './operator-dashboard-selected-machine.css',
})
export class OperatorDashboardSelectedMachine implements OnInit {
  private machineService = inject(MachineService);
  private router = inject(Router);

  // Deklarasi State Menggunakan Angular Signals
  machines = signal<Detailmachine[]>([]);
  selectedMachineId = signal<number | null>(null);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.fetchMachines();
  }

  fetchMachines(): void {
    this.isLoading.set(true);
    this.machineService.getMachineDetails().subscribe({
      next: (data) => {
        this.machines.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Gagal mengambil daftar mesin:', err);
        this.isLoading.set(false);
      }
    });
  }

  onConfirmMachine(): void {
    const currentSelectedId = this.selectedMachineId();
    
    if (!currentSelectedId) {
      alert('Silakan pilih mesin terlebih dahulu!');
      return;
    }

    // Navigasi ke rute operator dashboard by ID
    this.router.navigate(['/operator', currentSelectedId]);
  }

}