import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../_services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../_models/product';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit { 

  products: Product[] = []; 
  filteredProducts: Product[] = []; 
  
  search: string = '';
  select: string = '1'; 
  minPrice: number | null = null;
  maxPrice: number | null = null;

  categories: { [key: string]: string } = {
    "1": "",
    "2": "forHer",
    "3": "forHim"
  };

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) {}

  

  ngOnInit() {
    this.getAllProducts();
    
    this.route.paramMap.subscribe(params => {
      this.select = params.get('name') || "1";
      if (this.select) {
        this.filterProducts();
      } else {
        console.error("Category Name is undefined");
      }
    });
  }

  // Modify your getAllProducts method in ProductComponent
getAllProducts() {
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
              this.filterProducts();
            }
          },
          error: (error) => console.error(`Error fetching details for product ${item._id}:`, error)
        });
      });
    },
    error: (error) => console.error('Error fetching products:', error)
  });
}

  

  filterProducts() {
    const categoryValue = this.categories[this.select] || "";
    
    this.filteredProducts = this.products.filter(product => {

      const categoryMatch = !categoryValue || product.category === categoryValue;
      
      const searchMatch = !this.search || 
        product.name.toLowerCase().includes(this.search.toLowerCase());
      
      const minPriceMatch = !this.minPrice || product.price >= this.minPrice;
      const maxPriceMatch = !this.maxPrice || product.price <= this.maxPrice;
      
      return categoryMatch && searchMatch && minPriceMatch && maxPriceMatch;
    });
  }

  onSearchChange() {
    this.filterProducts(); 
  }

  viewDetails(productId: string) {
    this.router.navigate(['/product', productId]);
  }
}