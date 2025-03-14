import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminProductService } from '../../../../_services/admin-product.service';
import { AdminProduct } from '../../../../_models/admin-product';
import { SideBarComponent } from '../../core/side-bar/side-bar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule,SideBarComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  products: AdminProduct[] = [];
  selectedProduct: AdminProduct | null = null;
  updatedPrice: number | null = null;
  updatedStockQuantity: number | null = null;
  showCreateForm: boolean = false;
  newProduct: AdminProduct = new AdminProduct();

  constructor(private prosev: AdminProductService) {
    //default values
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      category: 'all',
      images: [],
      stockQuantity: 0,
      sellerinfo: { id: '', name: '' },
      isActive: false,
      isBestSeller: false,
      salesCount: 0,
    };
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.prosev.getAllProducts().subscribe({
      next: (data: AdminProduct[]) => {
        this.products = data;
        console.log(this.products);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  deleteProduct(productId: string | undefined): void {
    if (!productId) return;
    if (confirm('Are you sure you want to delete this product?')) {
      this.prosev.deleteProduct(productId).subscribe({
        next: () => {
          this.products = this.products.filter(
            (product) => product._id !== productId
          );
        },
        error: (error) => console.error('Error deleting product:', error),
      });
    }
  }

  toggleEdit(product: AdminProduct): void {
    if (this.selectedProduct?._id === product._id) {
      this.cancelEdit();
    } else {
      this.selectedProduct = product;
      this.updatedPrice = product.price || 0;
      this.updatedStockQuantity = product.stockQuantity || 0;
    }
  }

  saveProduct(): void {
    if (
      this.selectedProduct &&
      this.updatedPrice !== null &&
      this.updatedStockQuantity !== null
    ) {
      const updatedData = {
        price: this.updatedPrice,
        stockQuantity: this.updatedStockQuantity,
      };
      this.prosev
        .updateProduct(this.selectedProduct._id!, updatedData)
        .subscribe({
          next: () => {
            const index = this.products.findIndex(
              (p) => p._id === this.selectedProduct?._id
            );
            if (index !== -1) {
              this.products[index].price = this.updatedPrice!;
              this.products[index].stockQuantity = this.updatedStockQuantity!;
            }
            Swal.fire({
                        title: 'success',
                        text:"Product Updated Successfulyly",
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                      });
            this.cancelEdit();
          },
          error: (error) => {
            console.error('Error updating product:', error);
            Swal.fire({
                        title: 'Oops...',
                        text: error.message,
                        icon: 'error',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                      });
          },
        });
    }
  }

  cancelEdit(): void {
    this.selectedProduct = null;
    this.updatedPrice = null;
    this.updatedStockQuantity = null;
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetNewProduct();
    }
  }

  saveNewProduct(): void {
    if (this.newProduct.images && typeof this.newProduct.images === 'string') {
      this.newProduct.images = (this.newProduct.images as string)
        .split(',')
        .map((img) => img.trim());
    }
    this.prosev.createProduct(this.newProduct).subscribe({
      next: (createdProduct: AdminProduct) => {
        this.products.push(createdProduct); // Add new product
        alert('Product created successfully');
        this.resetNewProduct();
        this.showCreateForm = false;
      },
      error: (error) => {
        console.error('Error creating product:', error);
        alert('Failed to create product');
      },
    });
  }

  cancelCreate(): void {
    this.resetNewProduct();
    this.showCreateForm = false;
  }

  resetNewProduct(): void {
    this.newProduct = new AdminProduct();
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      category: 'all',
      images: [],
      stockQuantity: 0,
      sellerinfo: { id: '', name: '' },
      isActive: false,
      isBestSeller: false,
      salesCount: 0,
    };
  }
}