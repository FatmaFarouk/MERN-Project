import { Component, OnInit } from '@angular/core';
import { SideNavComponent } from '../../../core/side-nav/side-nav.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { OrderService } from '../../../_services/cashierOrder.service';
import { Product } from '../../../_models/product';
import { ProductService } from '../../../_services/product.service';
import Swal from 'sweetalert2';
import { CartService } from '../../../_services/cart.service';
import { data, error } from 'jquery';
import { Staff } from '../../../_models/staff';

@Component({
  selector: 'app-cashier-home',
  imports: [MatSidenavModule, SideNavComponent],
  templateUrl: './cashier-home.component.html',
  styleUrl: './cashier-home.component.css',
})
export class CashierHomeComponent implements OnInit {
  constructor(
    private cashierService: OrderService,
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  inventoryItem: any[] = [];
  produtId: any;
  Name: any;
  pic: any;
  inventoryName: any;
  CashierId:any;
  staff:Staff=new Staff()

  ngOnInit(): void {
    this.CashierId =  localStorage.getItem('StaffId') || '';
    this.getinvId()
    
  }
  //getinventory product
  fetchProduct(branchId: string) {
    this.cashierService.getInventory(branchId).subscribe({
      next: (data) => {
        this.inventoryItem = data.products.map((item: any) => ({
          ...item,
          productName: 'Loading...', // Placeholder
          productImage: '',
        }));
        this.inventoryName = data.branchLocation;

        //fetch product detail
        this.inventoryItem.forEach((item, index) => {
          this.productService.getProductById(item.productId).subscribe({
            next: (product) => {
              this.inventoryItem[index].productName = product.name;
              this.inventoryItem[index].productImage =
                product.images?.[0] || 'not found';
              this.inventoryItem[index].price = product.price;
            },
            error: () => {
              this.inventoryItem[index].productName = 'Product Not Found';
            },
          });
        });
      },
      error: (err) => {
        console.log('Error fetching cashier data:', err);
      },
    });
  }

  //addtocart
  addtocart(productId: string, quantity: number = 1): void {
    this.cashierService.addToCart(this.CashierId, productId, quantity).subscribe({
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error.message,
        });
      },
    });

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "itam add to cart",
      showConfirmButton: false,
      timer: 1000
  })

}

getinvId()
{
  this.cashierService.getCashier(this.CashierId).subscribe({
    next:(data)=>{this.staff=data
      const branchId = this.staff.branchId || "haha";
      this.fetchProduct(branchId);
    },
    error:(err)=>console.log(`Error retriving inv ${err}`)
  })

}
}
