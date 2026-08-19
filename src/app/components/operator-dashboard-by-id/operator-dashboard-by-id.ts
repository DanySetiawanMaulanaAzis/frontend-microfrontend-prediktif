import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MachineService } from '../../services/machine';
import { Detailmachine } from '../../models/detailmachine';

@Component({
  selector: 'app-operator-dashboard-by-id',
  imports: [CommonModule],
  templateUrl: './operator-dashboard-by-id.html',
  styleUrl: './operator-dashboard-by-id.css',
})
export class OperatorDashboardById implements OnInit {
  private route = inject(ActivatedRoute);
  private machineService = inject(MachineService);

  machine = signal<Detailmachine | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const machineId = Number(idParam);
      this.fetchMachineDetail(machineId);
    }
  }

  fetchMachineDetail(id: number): void {
    this.isLoading.set(true);
    this.machineService.getMachineDetailById(id).subscribe({
      next: (data) => {
        this.machine.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Gagal memuat detail mesin:', err);
        this.isLoading.set(false);
      }
    });
  }

  // Method styling status badge berdasarkan nama status
  getStatusClass(statusName: string | undefined): string {
    switch (statusName?.toLowerCase()) {
      case 'routine':
        return 'status-routine';
      case 'minor':
        return 'status-minor';
      case 'major':
        return 'status-major';
      case 'critical':
      case 'kritis':
        return 'status-critical';
      default:
        return 'status-routine';
    }
  }

  // Method styling warna teks persentase (0-100%)
  getScoreClass(score: number | undefined): string {
    const val = score ?? 0;
    if (val >= 85) return 'score-emerald'; // Hijau (85-100%)
    if (val >= 65) return 'score-amber';   // Kuning (65-84%)
    if (val >= 40) return 'score-orange';  // Oranye (40-64%)
    return 'score-red';                    // Merah (0-39%)
  }

  onCallTechnician(): void {
    const currentMachine = this.machine();
    if (currentMachine) {
      console.log(`Panggilan teknisi dikirim untuk mesin: ${currentMachine.machineName}`);
    }
  }
}