import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MachineService } from '../../services/machine';
import { Detailmachine } from '../../models/detailmachine';

export interface DialogData {
  machine: Detailmachine;
}

@Component({
  selector: 'app-operator-dashboard-call-technician-by-id-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './operator-dashboard-call-technician-by-id-dialog.html',
  styleUrl: './operator-dashboard-call-technician-by-id-dialog.css',
})
export class OperatorDashboardCallTechnicianByIdDialog implements OnInit {
  private machineService = inject(MachineService);

  // Signal State QR
  qrImageUrl = signal<string | null>(null);
  isQrLoading = signal<boolean>(false);

  constructor(
    public dialogRef: MatDialogRef<OperatorDashboardCallTechnicianByIdDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.loadQrCode();
  }

  loadQrCode(): void {
    // Menggunakan 'id' langsung dari object machine
    const id = this.data?.machine?.id;
    
    if (id) {
      this.isQrLoading.set(true);

      this.machineService.getMachineQrCode(id).subscribe({
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
    } else {
      console.error('ID Mesin tidak ditemukan dalam data dialog');
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}