import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../_services/cart.service';
import { ProductService } from '../../../_services/product.service';
import {OrderService} from '../../../_services/cashierOrder.service'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { order, PaymentMethod } from '../../../_models/cashierOrder';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideNavComponent } from "../../../core/side-nav/side-nav.component";

@Component({
  selector: 'app-ceckout',
  imports: [CommonModule, FormsModule, SideNavComponent],
  templateUrl: './ceckout.component.html',
  styleUrl: './ceckout.component.css'
})
export class CeckoutComponent implements OnInit {
  cartItems: any[] = [];
    total: any[] = [];
    produtId:any;
    ProductName:any;
    pic:any;
    CashierId?:any;
    Order: order=new order;


    constructor(private productService:ProductService,private cashierService:OrderService,private router:Router) {}
  
    ngOnInit(): void {
      this.CashierId =  localStorage.getItem('StaffId') || '';
      this.Order.CashierId=this.CashierId;
      this.loadCart(this.CashierId);                          
    }
  
    //load cart item
    loadCart(cashierId:string): void {
      this.cashierService.getCart(cashierId).subscribe({
        next: (data) => {
          this.cartItems = data.items.map((item:any) => ({
            ...item,
            productName: 'Loading...', // Placeholder
            productImage: '' // Placeholder image
          }));
  
          this.total = data.totalAmount;
  
          // Fetch product details for each item in the cart
          this.cartItems.forEach((item, index) => {
            this.productService.getProductById(item.productId).subscribe({
              next: (product) => {
                this.cartItems[index].productName = product.name;
                this.cartItems[index].productImage = product.images?.[0] || 'assets/default-product.jpg';
              },
              error: () => {
                this.cartItems[index].productName = 'Product not found';
              }
            });
          });
        },
        error: (error) => console.error('Error loading cart:', error),
      });
    }
  
    //Add item to cart
    addToCart(productId: string, quantity: number = 1): void {
      this.cashierService.addToCart(this.CashierId,productId, quantity).subscribe({
        next: () => this.loadCart(this.CashierId),
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.error.message,
          });
        },
      });
    }
  
    //reomve from cart
    removeFromCart(productId: string): void {
      this.cashierService.removeFromCart(this.CashierId,productId).subscribe({
        next: () => this.loadCart(this.CashierId),
        error: (err) => console.error('Error removing item from cart:', err),
      });
    }
  
    //decrese item quantity in cart
    decreaseCartItem(productId: string, quantity: number = 1): void {
      this.cashierService.decreaseCartItem(this.CashierId,productId, quantity).subscribe({
        next: () => this.loadCart(this.CashierId),
        error: (err) => console.error('Error decreasing item quantity:', err),
      });
    }
  
    //get product detail
    getProductDetail(productId:string){
      this.productService.getProductById(productId).subscribe({
        next:(data)=>{this.ProductName=data.name,this.pic=data.images[0]} 
      })
  
    }
  
  
    //unavailable section
    get unavailableItems() {
      return this.cartItems.filter((item) => !item.isAvailable).length > 0;
    }
    //-------------------Order--------------------------
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
      submitted: boolean | undefined;
    
      
    
      //select payment method
      selectPaymentMethod(method: PaymentMethod) {
        this.Order.paymentMethod = method;
      }
    
      //create obj
      
      paymentMethod = PaymentMethod;
    
      //create order
      placeOrder() {
        if (this.cartItems.length === 0) {
          Swal.fire({
            icon:"warning",
            title: 'Cart is empty!',
          });
          return;
        }

        this.router.navigate(['/cashier/getInventory/']);
        this.submitted = true;
    
        if(this.Order.paymentMethod===this.paymentMethod.CashOnDelivery){
          this.Order.CVVCode=1;
          this.Order.CreditCardNumber=1;
          this.Order.ExpiryMonth=1;
          this.Order.ExpiryYear=1;
        }
    
        if (
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
        console.log(this.Order)

        this.cashierService.createOrder(this.Order).subscribe({
          next: (data) => console.log('order created:', data),
          error: (err) => Swal.fire({
            icon: 'warning',
            title: `Failed to place order ${err.error.message}`,
          })
        });
        
    
        Swal.fire({
          icon: "success",
          title: 'Your order has been placed successfully',
        })
    
        this.router.navigate(['/cashier/getInventory/']);
      }
}
