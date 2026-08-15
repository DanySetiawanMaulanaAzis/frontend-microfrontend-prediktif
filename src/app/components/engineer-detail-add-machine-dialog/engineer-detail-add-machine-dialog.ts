import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Createandupdatemachinerequest } from '../../models/createandupdatemachinerequest';

@Component({
  selector: 'app-engineer-detail-add-machine-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule,],
  templateUrl: './engineer-detail-add-machine-dialog.html',
  styleUrl: './engineer-detail-add-machine-dialog.css',
})
export class EngineerDetailAddMachineDialog {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EngineerDetailAddMachineDialog>);

  machineForm: FormGroup = this.fb.group({
    machineName: ['', [Validators.required, Validators.minLength(3)]],
    location: ['', [Validators.required]],
    productionYear: [
      new Date().getFullYear(),
      [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)],
    ],
  });

  onSubmit(): void {
    if (this.machineForm.invalid) {
      this.machineForm.markAllAsTouched();
      return;
    }

    const formData: Createandupdatemachinerequest = this.machineForm.value;
    // Mengembalikan data form ke Parent Component
    this.dialogRef.close(formData);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
