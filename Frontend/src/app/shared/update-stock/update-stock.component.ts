import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-stock-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    // BrowserAnimationsModule,
    CommonModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>Update Stock</h2>
    <mat-dialog-content>
      <form [formGroup]="stockForm">
        <mat-form-field appearance="fill">
          <mat-label>Quantity to Add</mat-label>
          <input matInput type="number" formControlName="quantity" required>
          <mat-error *ngIf="stockForm.get('quantity')?.hasError('required')">
            Quantity is required
          </mat-error>
          <mat-error *ngIf="stockForm.get('quantity')?.hasError('min')">
            Minimum quantity is 1
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="!stockForm.valid"
              [mat-dialog-close]="stockForm.value.quantity">
        Update
      </button>
    </mat-dialog-actions>
  `
})
export class UpdateStockComponent {
  stockForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { currentStock: number }
  ) {
    this.stockForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }
}