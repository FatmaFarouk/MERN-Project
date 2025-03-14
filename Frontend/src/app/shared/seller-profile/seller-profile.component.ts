
import { UserService } from './../../_services/user.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../_services/order.service';
import {GetsetproductsService} from '../../_services/getsetproducts.service';

@Component({
  selector: 'app-seller-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seller-profile.component.html',
  styleUrl: './seller-profile.component.css'
})
export class SellerProfileComponent {
  orderhistory: any[] = [];
  customerId?: string;
  userForm!: FormGroup; 
  user : any = [];

  storedData = localStorage.getItem('token');
  userId = this.storedData ? JSON.parse(this.storedData).userId : null;
  sales: any;
  inventory: any;

  constructor(private formBuilder: FormBuilder, private orderService: OrderService, private userService: UserService, private sellerData: GetsetproductsService) { }


  ngOnInit(): void {
    this.userForm = this.formBuilder.nonNullable.group({
      firstName: ['', [Validators.required, Validators.pattern("^[A-Za-z]+([ '-][A-Za-z]+)*$")]],
      lastName: ['', [Validators.required, Validators.pattern("^[A-Za-z]+([ '-][A-Za-z]+)*$")]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      isActive: [1]
    }, { validators: this.matchPassword });

    this.sales = this.sellerData.getSalesAnalysis();
    this.inventory = this.sellerData.getInventoryAnalysis();
   // this.getOrderHistory();
    
  }

  getTotalQuantity(items: any[]): number {
    if (!items || !items.length) {
      return 0;
    }
    
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  }

  getOrderHistory(): void {
    // console.log(this.userId);
    this.orderService.getOrderByCustomerId(this.userId).subscribe(
      {
        next: (data) => {
          this.orderhistory = data;
          // console.log(this.orderhistory);
        },
        error: (error) => {
          console.error('error fetchinh order history: ', error);
        }
      }
    );
    
  }

  password: string = '';
  confirmPassword: string = '';

  roles = ['customer', 'seller', 'admin', 'manager', 'cashier', 'salesClerk', 'supplier'];

  loadUserProfile(): void {
    this.userService.getUserById("fatma").subscribe(data => {
      this.user = data;
    });
  }


  matchPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  //analysis 
  getProductName(productId: string): string {
    return this.sellerData.getProducts().find(p => p._id === productId)?.name || 'Unknown Product';
  }

  onSubmit() {
    if (this.userForm) {
      Swal.fire({
        title: 'Success!',
        text: 'Your profile has been updated successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      console.log(this.userForm.value);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill in all required fields correctly.',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  }

}
