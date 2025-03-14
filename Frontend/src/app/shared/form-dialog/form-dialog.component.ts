import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ProductService} from '../../_services/product.service';
import { MatDialogRef } from '@angular/material/dialog';
import {Product} from '../../_models/product';
import { SuccessModalComponent } from '../success-modal/success-modal.component';


@Component({
  selector: 'app-form-dialog',
  imports: [ReactiveFormsModule,CommonModule,SuccessModalComponent],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.css'
})
export class FormDialogComponent {
  productForm: FormGroup;
  //selectedFile: File | null = null;
  selectedFiles: File[] = [];
  uploadProgress = 0;
  isSubmitting = false;
  categories = [
    { value: 'all', display: 'All' },
    { value: 'forHer', display: 'For Her' },
    { value: 'forHim', display: 'For Him' }
  ];

  @ViewChild(SuccessModalComponent) successModal!: SuccessModalComponent;
  sellerid:any;
  username:any;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<FormDialogComponent> 
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      category: ['all', Validators.required],
      stockQuantity: [null, [Validators.required, Validators.min(1)]], 
    });

    this.sellerid=this.getUserId();

    
      this.productService.getUserNameById(this.sellerid).subscribe(
        (user) => this.username=user.firstName,
        (error) => console.error('Error:', error)
      );
  }


  //
  get nameControl() { return this.productForm.get('name'); }
get priceControl() { return this.productForm.get('price'); }
get descriptionControl() { return this.productForm.get('description'); }
get categoryControl() { return this.productForm.get('category'); }
get stockQuantityControl() { return this.productForm.get('stockQuantity'); }

// onFileSelected(event: any) {
//   this.selectedFile = event.target.files[0];
//   this.fileTouched = true;
// }

onFileSelected(event: any) {
  const files: FileList = event.target.files;
  if (files.length > 0) {
    this.selectedFiles = Array.from(files).slice(0, 4); // Limit to 4 files
    this.fileTouched = true;
  }
}

generateUniqueId(): string {
  return `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

getUserId(): string | null {
  const storedToken = localStorage.getItem('token'); // Retrieve token from local storage
  if (storedToken) {
      try {
          const tokenData = JSON.parse(storedToken); // Parse JSON
          return tokenData.userId || null; // Return userId if exists
      } catch (error) {
          console.error('Error parsing token:', error);
          return null;
      }
  }
  return null;
}


  onSubmit() {
    if (this.productForm.valid && this.selectedFiles) {
      this.isSubmitting = true;

     //
  this.fileTouched = true;

      if (this.productForm.invalid) {
        console.error('Form is invalid', this.productForm.errors);
        return;
      }
      
      const formData = new FormData();

      
      // Append product data
      Object.keys(this.productForm.value).forEach(key => {
        formData.append(key, this.productForm.value[key]);
      });

      console.log('Form Values:', this.productForm.value);

      this.selectedFiles.forEach((file, index) => {
        formData.append('images', file, file.name);
      });

      
      
      console.log('User:', this.username);
      const sellerInfo: any = {
        id: this.sellerid,
        name: this.username 
      };

      // Append image file
      //formData.append('images', this.selectedFile, this.selectedFile.name);
      formData.append('sellerInfo', JSON.stringify(sellerInfo));
      let id:string=this.generateUniqueId();
      formData.append('_id', id);


      console.log('Submitting:', formData); 
      console.log('FormData keys:', [...formData.keys()]); 

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]); 
      }
      

      this.productService.addProduct(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
            this.dialogRef.close(this.productForm.value);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.log(error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close(); 
  }

  fileTouched = false;
  //success product creation modal 
  handleModalClose() {
    console.log('Modal closed');
  }
 
  
}
