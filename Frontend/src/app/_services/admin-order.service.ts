import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Order } from '../_models/admin/order';

@Injectable({
  providedIn: 'root',
})
export class AdminOrderService {
  private apiUrl = 'http://localhost:3000/order';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http
      .get<{ orders: Order[] }>(`${this.apiUrl}/getAllOrders`)
      .pipe(map((response) => response.orders));
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/getorderById/${id}`);
  }

  updateOrderItemStatus(
    orderId: string,
    productId: string,
    newStatus: string
  ): Observable<any> {
    const body = { orderId, productId, newStatus };
    console.log('Sending update:', body);
    return this.http.patch(`${this.apiUrl}/update-item`, body);
  }
}
// updatePaymentMethod(orderId: string, paymentMethod: PaymentMethod): Observable<any> {
//   const body = { orderId, paymentMethod };
//   return this.http.put(`${this.apiUrl}/update-payment-method`, body); // Assuming this endpoint exists
// }
