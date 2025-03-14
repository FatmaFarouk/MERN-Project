import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { order } from '../_models/cashierOrder';
import {getData} from './gettokenstaff.service'

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/cashier';
  private apiUrl2 = 'http://localhost:3000/cart';


  constructor(private http: HttpClient,private getData:getData) {}

  createOrder(Order: order): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, Order,{
      headers: new HttpHeaders(this.getData.getAuthHeaders()),
    });
  }

  getAllOrders(filters: any = {}): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllOrders`, { params: filters });
  }

  getOrderByCashierId(cashierId:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/getOrders/${cashierId}`)
  }

  getCashier(CashierId:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/getCashier/${CashierId}`)
  }

  getInventory(branchId:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/getInventory/${branchId}`,{
      headers: new HttpHeaders(this.getData.getAuthHeaders()),
    });
  }

  addToCart(CashierId:string,productId:string,quantity:number): Observable<any> {
    return this.http.post(`${this.apiUrl}/addtocart`,{CashierId,productId,quantity},{
      headers: new HttpHeaders(this.getData.getAuthHeaders()),
    });
  }

  getCart(CashierId:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/${CashierId}`,{
      headers: new HttpHeaders(this.getData.getAuthHeaders()),
    })
  }

  //remove item from cart
  removeFromCart(customerId:string,productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl2}/remove`, {
      body: { customerId, productId },
    });
  }

  // Decrease item quantity in cart
  decreaseCartItem(customerId:string,productId: string, quantity: number): Observable<any> {
    return this.http.patch(`${this.apiUrl2}/dec`, {
      customerId,
      productId,
      quantity,
    });
  }

}
