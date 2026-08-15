import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EngineerDetailAddMachineDialog } from '../engineer-detail-add-machine-dialog/engineer-detail-add-machine-dialog';
import { MachineService } from '../../services/machine';
import { Machine } from '../../models/machine';
import { Createandupdatemachinerequest } from '../../models/createandupdatemachinerequest';
import { Detailmachine } from '../../models/detailmachine';

@Component({
  selector: 'app-engineer-detail',
  imports: [CommonModule, MatDialogModule, MatSnackBarModule, RouterLink],
  templateUrl: './engineer-detail.html',
  styleUrl: './engineer-detail.css',
})
export class EngineerDetail implements OnInit {
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar)
  private machineService = inject(MachineService);

  machines = signal<Machine[]>([]);
  machineDetails = signal<Detailmachine[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadMachineDetails();
  }

  loadMachines(): void {
    this.isLoading.set(true);
    this.machineService.getMachines().subscribe({
      next: (data) => {
        this.machines.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.snackBar.open('Gagal memuat data mesin', 'Tutup', { duration: 3000 });
      }
    });
  }

  loadMachineDetails(): void {
    this.isLoading.set(true);
    this.machineService.getMachineDetails().subscribe({
      next: (data) => {
        this.machineDetails.set(data);
        this.isLoading.set(false);
      },

      error: () => {
        this.isLoading.set(false);
        this.snackBar.open(
          'Gagal memuat data mesin',
          'Tutup',
          { duration: 3000 }
        );
      }
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(EngineerDetailAddMachineDialog, {
      width: '450px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: Createandupdatemachinerequest | null) => {
      // Jika user menekan Simpan (result berisi payload data)
      if (result) {
        this.saveMachine(result);
      }
    });
  }

  private saveMachine(data: Createandupdatemachinerequest): void {
    this.machineService.createMachine(data).subscribe({
      next: (res) => {
        this.snackBar.open('Mesin berhasil ditambahkan!', 'OK', { duration: 3000 });
        this.loadMachineDetails(); // Refresh data tabel
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Gagal menyimpan data mesin ke server', 'Tutup', { duration: 3000 });
      }
    });
  }
}
