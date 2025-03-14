import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import {
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent 
} from '@angular/material/dialog';


@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatDialogActions,
    MatDialogClose,    
    MatDialogTitle,  
    MatDialogContent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})

export class ConfirmationDialogComponent {
   constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onClose(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true); 
  }
}
