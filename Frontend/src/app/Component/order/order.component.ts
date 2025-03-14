import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../_services/order.service';
import { order, PaymentMethod } from '../../_models/order';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../_services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  imports: [FormsModule, CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  //iterate of mounth and year
  months: string[] = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  years: string[] = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];

  //customerId
  storedData = localStorage.getItem('token');
  userId = this.storedData ? JSON.parse(this.storedData).userId : null;
  Name: any;
  submitted: boolean | undefined;

  constructor(private orderservice: OrderService, private user: UserService,private router:Router) {}
  ngOnInit(): void {
    // this.getbyId();
  }

  //select payment method
  selectPaymentMethod(method: PaymentMethod) {
    this.Order.paymentMethod = method;
  }

  //create obj
  Order: order = new order(this.userId);
  paymentMethod = PaymentMethod;

  //create order
  placeOrder() {
    this.submitted = true;

    if(this.Order.paymentMethod===this.paymentMethod.CashOnDelivery){
      this.Order.CVVCode=1;
      this.Order.CreditCardNumber=1;
      this.Order.ExpiryMonth=1;
      this.Order.ExpiryYear=1;
    }

    if (
      !this.Order.shippingAddress ||
      !this.Order.PhoneNumber ||
      !this.Order.CVVCode ||
      !this.Order.CreditCardNumber ||
      !this.Order.ExpiryMonth ||
      !this.Order.ExpiryYear ||
      !this.Order.paymentMethod
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing require input...',
      })
      return 
    }

    this.orderservice.createOrder(this.Order).subscribe({
      next: (data) => console.log('order created:', data),
      error: (err) => Swal.fire({
        icon: 'warning',
        title: 'Failed to place order',
      })
    });
    

    Swal.fire({
      icon: "success",
      title: 'Your order has been placed successfully',
    })

    this.router.navigate(['/home']);
  }

  //get customer detail
  // getbyId(){
  //     this.user.getById(this.userId).subscribe({
  //       next:(data)=>this.Name=data.firstName+" "+data.lastName,
  //       error:(error)=>console.log(error.message)
  //     })
  // }
}
