import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getData } from './getData.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient, private getData: getData) {}

  //add item to cart
  addToCart(productId: string, quantity: number): Observable<any> {
    const customerId = this.getData.getCustomerId();
    return this.http.post(`${this.apiUrl}/add`, {
      customerId,
      productId,
      quantity,
    });
  }

  //get cart item
  getCart(): Observable<any> {
    const customerId = this.getData.getCustomerId();
    return this.http.get(`${this.apiUrl}/${customerId}`, {
      headers: new HttpHeaders(this.getData.getAuthHeaders()),
    });
  }

  //remove item from cart
  removeFromCart(productId: string): Observable<any> {
    const customerId = this.getData.getCustomerId();
    return this.http.delete(`${this.apiUrl}/remove`, {
      body: { customerId, productId },
    });
  }

  // Decrease item quantity in cart
  decreaseCartItem(productId: string, quantity: number): Observable<any> {
    const customerId = this.getData.getCustomerId();
    return this.http.patch(`${this.apiUrl}/dec`, {
      customerId,
      productId,
      quantity,
    });
  }

  clearCart(): Observable<any> {
    const customerId = this.getData.getCustomerId();
    return this.http.delete(`${this.apiUrl}/clear`, { body: { customerId } });
  }
}
