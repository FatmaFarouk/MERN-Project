import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../_services/product.service';
import { Product } from '../../../_models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-arrival',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-arrival.component.html',
  styleUrl: './new-arrival.component.css'
})
export class NewArrivalComponent implements OnInit{ 

  products: Product[] = [];
  newArrivals: Product[] = [];
  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.getNewArrival();
  }

  getNewArrival(): void {
    this.productService.getAll().subscribe({
      next: (data: any[]) => {
        let products: Product[] = [];

        data.forEach(item => {
          this.productService.getProductById(item._id).subscribe({
            next: (productDetails: any) => {
              const product = new Product(
                item._id,
                productDetails.name || 'Unknown Product',
                productDetails.description || '',
                productDetails.price || 0,
                productDetails.category || '',
                productDetails.images || ['assets/default-product.jpg'],
                item.stock, 
                productDetails.stockId || '',
                productDetails.branchLocation || '',
                productDetails.createdAt || new Date().toISOString(),
                productDetails.isBestSeller || false,
                productDetails.salesCount || 0,
                productDetails.SellerInfo || {_id: 0, name: 'Unknown Seller'},
                productDetails.isActive !== undefined ? productDetails.isActive : true
              );
              
              products.push(product);
              
              if (products.length === data.length) {
                this.products = products;
                this.newArrival();
              }
            },
            error: (error) => console.error(`Error fetching details for product ${item._id}:`, error)
          });
        });
      },
      error: (error) => console.error('Error fetching products:', error)
    });
  }

  newArrival(): void {
    const currentDate = new Date();
  const days = 30;

  this.newArrivals = this.products.filter(product => {
    // Ensure createdAt is a valid date
    if (!product.createdAt) {
      return false;
    }
    
    const productDate = new Date(product.createdAt);
    
    // Check if productDate is valid
    if (isNaN(productDate.getTime())) {
      return false;
    }
    
    const timeDifference = currentDate.getTime() - productDate.getTime();
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    return daysDifference <= days;
  });
  }

  viewDetails(productId: string) {
    this.router.navigate(['/product', productId]);
  }

}