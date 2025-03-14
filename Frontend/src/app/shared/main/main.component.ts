import { Component,OnInit,NgModule,ChangeDetectorRef ,ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ProductService} from '../../_services/product.service';
import { Product } from '../../_models/product';
import { OrderService } from '../../_services/order.service';
import { order } from '../../_models/order'; 
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormDialogComponent } from '../form-dialog/form-dialog.component';
import { ChangeDetectionStrategy } from '@angular/core';
import {UpdateStockComponent} from '../update-stock/update-stock.component';
import { MatIconModule } from '@angular/material/icon';
import { 
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SellerAnalysisComponent } from '../seller-analysis/seller-analysis.component';
import {ProfitAnalysisComponent} from '../profit-analysis/profit-analysis.component';
import {OrderStatusAnalysisComponent} from '../order-status-analysis/order-status-analysis.component';
import { GetsetproductsService } from '../../_services/getsetproducts.service';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import {AuthService} from '../../_services/auth.service';






@Component({
  selector: 'app-main',
  imports: [FormsModule,CommonModule,MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatDialogContent,MatDialogClose,MatDialogTitle,MatDialogActions,
    SellerAnalysisComponent,
    ProfitAnalysisComponent,
    OrderStatusAnalysisComponent,
    SuccessModalComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class MainComponent implements OnInit {
  constructor( private productService:ProductService, private orderService:OrderService,private dialog: MatDialog,private cdr: ChangeDetectorRef,private sellerProductsService: GetsetproductsService, private authService:AuthService){}

  sellerProducts:Product[]=[];

  sellerId:any=this.getUserId();

  ngOnInit(): void {
    //getuser data:
    this.sellerId=this.getUserId();
     this.loadSellerProduct();
      this.loadSellerOrders(this.sellerId);
      console.log(this.sellerId);
      console.log(this.options); 

      this.productService.products$.subscribe(products => {
        this.sellerProducts = products;
      });

      //order anlysis 
      // var ordderanalysis:any[]=this.countApprovedItemsByMonthv(this.sellerOrders);
      // console.log('here');
      
      // console.log('hell'+ordderanalysis);
  }


//get seller id
getUserId(): string | null {
  const storedToken = localStorage.getItem('token'); // Retrieve token from local storage
  if (storedToken) {
      try {
          const tokenData = JSON.parse(storedToken); // Parse JSON
          return tokenData.userId || null; // Return userId if exists
      } catch (error) {
          console.error('Error parsing token:', error);
          return null;
      }
  }
  return null;
}

  
loadSellerProduct() {
  this.productService.getProducts(this.sellerId).subscribe({
    next: (data) => {
      const activeProducts = (data as Product[]).filter(product => product.isActive === true);

      this.sellerProducts = [...activeProducts];
      console.log(activeProducts);

      this.filteredProducts = [...activeProducts];
      this.cdr.detectChanges();

      this.sellerProductsService.setProducts(this.sellerProducts);
    },
    error: (error) => {
      console.error('Error loading seller products:', error);
    }
  });
}


  Deleteproduct(productId:any){
    this.productService.DeleteProduct(productId).subscribe({
      next:()=>this.loadSellerProduct(),
      error:(err)=> console.error('Error removing item from seller product:',err)
    })
  }

   ///////order service///////
   sellerOrders:order[]=[];

  //modal functions
  openDialog(productId:any): void { 
    let isfound=false;
    let DialogMessage;
    this.sellerOrders.forEach(order => {
      order.items?.forEach(item => {
        if(item.sellerId==this.sellerId)
          isfound=true;
      });
    });
    if(isfound)
       DialogMessage='Orders with this product will be cancelled';
    else
      DialogMessage='Are you sure you want to proceed?';

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: { message: DialogMessage}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //call delete pass product id , 
        this.Deleteproduct(productId);
        //inside delete loop in orders and change items status to rejected
        this.sellerOrders.forEach(order => {
          order.items?.forEach(item => {
            if(item.sellerId==this.sellerId&&item.productId==productId){
              item.itemStatus='rejected'; /////////you are not updating DB!!!! //call updateorder
              this.UpdateItemstate(order._id,item.productId,'rejected');
              //reload/get orders array again 
              this.loadSellerOrders(this.sellerId);

            }
          });
        });
        console.log('User confirmed');
      } else {
        console.log('User canceled');
      }
    });
  }

 

  loadSellerOrders(sellerId:any)
  {
    this.orderService.getorders(sellerId).subscribe({
      next:(data)=>{
        this.sellerOrders=data,console.log(data);
         this.monthlySalesData=this.countApprovedOrdersByMonth(this.sellerOrders);
         this.sellerProductsService.setOrders(data);
      },
      error:(error)=>{console.error('Error loading seller products:', error);}
    })
  }

  UpdateItemstate(orderId:any, productId:any, newStatus:any)
  {
    this.orderService.updateitemstatus(orderId, productId, newStatus).subscribe(response => console.log("update item status service response"+response));
  }

  //
  selectedOption: any = null;
  isDisabled = false;

  options = ['rejected', 'approved'];

  onSelectChange(orderId:any,productId:any,value: string) {
    this.selectedOption = value;
    this.orderService.updateitemstatus(orderId, productId, this.selectedOption).subscribe(response => console.log("update item status service response"+response));
    this.isDisabled = true; // Disable dropdown after selection
  }


  /////////Add product//////
//product dialog 
openFormDialog(): void { 
  const dialogRef = this.dialog.open(FormDialogComponent, {
    width: '440px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadSellerProduct();

      this.dialog.open(SuccessModalComponent, {
        data: { message: 'Product created successfully!' },
        width: '400px'
      });

      console.log('User confirmed');
    } else {
      console.log('User canceled');
    }
  });
}


//////analysis ///////
//1. orders analysis 
countApprovedOrdersByMonth(orders: order[]) {
  const monthlyCounts = new Array(12).fill(0);
  const currentYear = new Date().getFullYear(); 

  orders.forEach(order => {
     if (!order.updatedAt) return;
      
      let orderDate: Date |any = order.updatedAt ? new Date(order.updatedAt) : undefined;
      if (isNaN(orderDate.getTime())) return;
    // Use orderDate field that reflects when the order was approved
     orderDate = orderDate ? new Date(orderDate) : null; 
    
    // Validate date
    if (!orderDate || isNaN(orderDate.getTime())) return;
    
    // Check if the order is from current year
    if (orderDate.getFullYear() !== currentYear) return;

    // Count approved items
    const approvedCount = order.items?.filter(
      item => item.itemStatus?.toLowerCase() === 'approved' // Case-insensitive check
    ).length || 0;

    // Add to correct month (0-11)
    monthlyCounts[orderDate.getMonth()] += approvedCount;
  });

  return monthlyCounts;
}



///
 countApprovedItemsByMonthv(orders: order[]): { month: string; count: number }[] {
  const monthlyCounts = new Map<string, number>();
  const years = new Set<number>();

  orders.forEach(order => {
    if (!order.updatedAt) return;
    const orderDate: Date |any = order.updatedAt ? new Date(order.updatedAt) : undefined;
    if (isNaN(orderDate.getTime())) return;

    console.log('data'+orderDate);

    const year = orderDate.getFullYear();
    years.add(year);

    const monthKey = `${year}-${(orderDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

      console.log('month'+monthKey);

    const approvedCount:any = order?.items?.filter(
      (item: any) => item.itemStatus === 'approved'
    ).length;

    monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) || 0) + approvedCount);
  });

  // Generate all months for collected years with proper formatting
  const allMonths: { month: string; count: number }[] = [];
  years.forEach(year => {
    for (let month = 1; month <= 12; month++) {
      const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
      allMonths.push({
        month: monthKey,
        count: monthlyCounts.get(monthKey) || 0
      });
    }
  });

  return allMonths.sort((a, b) => a.month.localeCompare(b.month));
}

///order_date coulm helper function
formatDate(date: any): string {
  if (!date) {
    return 'N/A'; // Handle undefined or null values
  }

  const parsedDate = new Date(date); // Convert MongoDB date to JavaScript Date
  if (isNaN(parsedDate.getTime())) {
    return 'Invalid Date';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24-hour format
  }).format(parsedDate);
}



//update stock 
openUpdateStockDialog(product: Product): void {
  const dialogRef = this.dialog.open(UpdateStockComponent, {
    data: { currentStock: product.stockQuantity }
  });

  dialogRef.afterClosed().subscribe(updateQty => {
    if (updateQty > 0) {
      this.productService.updateStock(product._id, updateQty).subscribe({
        next: () => this.loadSellerProduct(),
        error: (err) => console.error('Update failed:', err)
      });
    }
  });
} 


//search product
searchTerm: string = '';
filteredProducts: any[] = [];

applyFilter() {
  if (!this.searchTerm) {
    this.filteredProducts = [...this.sellerProducts];
    return;
  }
  
  this.filteredProducts = this.sellerProducts.filter(product => 
    product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}



  ////sslaes analysis data 
  monthlySalesData: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];



  //seller logout
  logSellerOut() {
    this.authService.logout();
  }
  

}
