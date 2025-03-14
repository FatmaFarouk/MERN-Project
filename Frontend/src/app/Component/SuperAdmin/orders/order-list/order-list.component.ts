import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../_models/admin/order';
import { AdminOrderService } from '../../../../_services/admin-order.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideBarComponent } from '../../core/side-bar/side-bar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-list',
  imports: [DatePipe, FormsModule,SideBarComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  selectedOrderId: string | null = null;

  ngOnInit(): void {
    this.ordSer.getAllOrders().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        console.log(this.orders);
      },
      error: (err) => console.error('Error fetching orders:', err),
    });
  }

  toggleDetails(orderId: string | undefined): void {
    if (!orderId) return;
    this.selectedOrderId = this.selectedOrderId === orderId ? null : orderId;
  }

  updateItemStatus(
    orderId: string | undefined,
    productId: string,
    newStatus: string
  ): void {
    if (!orderId) {
      console.error('Order ID is undefined');
      return;
    }
    this.ordSer.updateOrderItemStatus(orderId, productId, newStatus).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        const order = this.orders.find((o) => o._id === orderId);
        if (order && order.items) {
          const item = order.items.find((i) => i.productId === productId);
          if (item) item.itemStatus = newStatus;
        }
        Swal.fire({
                    title: 'success',
                    text: "Order item updated Successfully",
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                  });
      },
      error: (err) => {
        console.error('Error updating status:', err);
        Swal.fire({
                    title: 'Oops...',
                    text: err.message,
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

  constructor(public ordSer: AdminOrderService) {}
}



// import { Component, OnInit } from '@angular/core';
// import { Order } from '../../../../_models/admin/order';
// import { AdminOrderService } from '../../../../_services/admin-order.service';
// import { DatePipe } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-order-list',
//   imports: [DatePipe, FormsModule],
//   templateUrl: './order-list.component.html',
//   styleUrl: './order-list.component.css',
// })
// export class OrderListComponent implements OnInit {
//   orders: Order[] = [];
//   selectedOrderId: string | null = null;

//   ngOnInit(): void {
//     this.ordSer.getAllOrders().subscribe({
//       next: (data: Order[]) => {
//         this.orders = data;
//         console.log(this.orders);
//       },
//       error: (err) => console.error('Error fetching orders:', err),
//     });
//   }

//   toggleDetails(orderId: string | undefined): void {
//     if (!orderId) return;
//     this.selectedOrderId = this.selectedOrderId === orderId ? null : orderId;
//   }
//   updateItemStatus(
//     orderId: string | undefined,
//     productId: string,
//     newStatus: string
//   ): void {
//     if (!orderId) {
//       console.error('Order ID is undefined');
//       return;
//     }
//     this.ordSer.updateOrderItemStatus(orderId, productId, newStatus).subscribe({
//       next: (response) => {
//         console.log('API Response:', response);
//         const order = this.orders.find((o) => o._id === orderId);
//         if (order && order.items) {
//           const item = order.items.find((i) => i.productId === productId);
//           if (item) item.itemStatus = newStatus;
//         }
//         alert('Status updated successfully');
//       },
//       error: (err) => {
//         console.error('Error updating status:', err);
//         alert('Failed to update status');
//       },
//     });
//   }
//   constructor(public ordSer: AdminOrderService) {}
// }
