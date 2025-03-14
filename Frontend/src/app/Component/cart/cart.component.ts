import { Component, OnInit } from '@angular/core';
import { CartService } from '../../_services/cart.service';
import { ProductService } from '../../_services/product.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total: any[] = [];
  produtId:any;
  Name:any;
  pic:any;
  constructor(private cartService: CartService,private productService:ProductService,private router:Router) {}

  ngOnInit(): void {
    this.loadCart(); 
                                       
  }

  //load cart item
  loadCart(): void {
    this.cartService.getCart().subscribe({
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
    this.cartService.addToCart(productId, quantity).subscribe({
      next: () => this.loadCart(),
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
    this.cartService.removeFromCart(productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Error removing item from cart:', err),
    });
  }

  //decrese item quantity in cart
  decreaseCartItem(productId: string, quantity: number = 1): void {
    this.cartService.decreaseCartItem(productId, quantity).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Error decreasing item quantity:', err),
    });
  }

  //get product detail
  getProductDetail(productId:string){
    this.productService.getProductById(productId).subscribe({
      next:(data)=>{this.Name=data.name,this.pic=data.images[0]} 
    })

  }

  Checkout() {
    if (this.cartItems.length === 0) {
      Swal.fire({
        icon:"warning",
        title: 'Cart is empty!',
      });
      return;
    }
    this.router.navigate(['/order']);
  }

  //unavailable section
  get unavailableItems() {
    return this.cartItems.filter((item) => !item.isAvailable).length > 0;
  }
}