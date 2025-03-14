
// import { Component, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   imports: [CommonModule],
//   selector: 'app-success-modal',
//   templateUrl: './success-modal.component.html'
// })
// export class SuccessModalComponent {
//   @Output() onClose = new EventEmitter<void>();
//   isVisible = false;
//   message: string = 'Product created successfully!';
//   // show() {
//   //   console.log('Showing modal');
//   //   this.isVisible = true;
//   // }

//   // hide() {
//   //   this.isVisible = false;
//   //   this.onClose.emit();
//   // }

//   constructor(private cdr: ChangeDetectorRef) {}

//   show() {
//     console.log('Showing modal');
//     this.isVisible = true;
//     this.cdr.detectChanges(); // Force update view
//   }

//   hide() {
//     this.isVisible = false;
//     this.cdr.detectChanges(); // Force update view
//     this.onClose.emit();
//   }
// }

// success-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-success-modal',
  imports: [MatDialogModule],
  template: `
    <h2 mat-dialog-title>Success!</h2>
    <mat-dialog-content>
      {{ data.message }}
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>OK</button>
    </mat-dialog-actions>
  `
})
export class SuccessModalComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}