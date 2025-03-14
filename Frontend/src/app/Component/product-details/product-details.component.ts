import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../_services/product.service';
import { Product } from '../../_models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../_services/cart.service';
import  Swal  from 'sweetalert2';
import { AuthService } from '../../_services/auth.service';


@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.component.html',  
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  product: Product | null = null; 
  quantity: number = 1;
  customerId: string = "yasoo" 
  productId: string | null = null;

  constructor( private productService: ProductService, private route: ActivatedRoute, private router: Router, private cartService: CartService, private authService: AuthService) {}

  ngOnInit(): void {

    this.productId = this.route.snapshot.paramMap.get('id'); 
      if(this.productId) {
        this.productService.getProductById(this.productId).subscribe((data) => {
          this.product = data;
      });
      }

    // const productId = String(this.route.snapshot.paramMap.get('id')); 
    // this.productService.getProductById(productId).subscribe((data) => {
    //   this.product = data;
    // });

  }

  goBack() {
    this.router.navigate(['/products']); 
  }

  increaseQuantity(): void {
    if(this.quantity < 10) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if(this.quantity > 1) {
      this.quantity--;
    }
  }


  
  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      // Just show a quick toast notification
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please login to add products to your cart',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      
      // Immediately redirect to login page with return URL
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: `/product-details/${this.productId}` } 
      });
      return;
    }

    if(this.product && this.productId) {
      this.cartService.addToCart(this.productId, this.quantity).subscribe ({
        next: ()=> {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Product added to cart successfully!',
          }).then(() => {
            this.router.navigate(['/cart']);
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.error.message,
          });
        }
      }) 
    }
  }
}