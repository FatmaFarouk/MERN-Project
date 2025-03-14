import { ProductService } from './../../../_services/product.service';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Product } from '../../../_models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-best-seller',
  imports: [CommonModule, FormsModule],
  templateUrl: './best-seller.component.html',
  styleUrl: './best-seller.component.css'
}) 
export class BestSellerComponent implements OnInit{
  products: Product[] =[];
  bestSellers: Product[] = [];
  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
   this.getBestSeller(); 
  }

  getBestSeller(): void {
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
                this.bestSeller(products);
              }
            },
            error: (error) => console.error(`error fetching details for product ${item._id}:`, error)
          });
        });
      },
      error: (error) => console.error('error fetching products:', error)
    });
  }

  
  bestSeller(products: Product[]): void {
    this.products = products;
    this.bestSellers = this.products.filter(product => product.isBestSeller === true || (product.salesCount !== undefined && product.salesCount >= 50));
  }
  

  


  viewDetails(productId: string) {
    this.router.navigate(['/product', productId]);
  }
}