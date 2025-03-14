import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {order} from '../_models/order'
import { getData } from './getData.service';

@Injectable({

  providedIn: 'root'
})
export class OrderService {
  private apiUrl="http://localhost:3000/order";

  constructor(private http:HttpClient,private getData: getData){}

  createOrder(Order:order):Observable<any>{
    const httpOptions = new HttpHeaders(this.getData.getAuthHeaders());
    return this.http.post(`${this.apiUrl}/add`,Order,{headers: new HttpHeaders(this.getData.getAuthHeaders())});
  }


//Era oder.service 
getorders(sellerId:any):Observable<any>{
  return this.http.get(`${this.apiUrl}/getSellerOrders/${sellerId}`);
}

updateitemstatus(orderId:any,productId:any,newStatus:any):Observable<any>{
  return this.http.put(`${this.apiUrl}/${orderId}/items/${productId}/status`, { newStatus });
}




  getOrderByCustomerId(customerId: string): Observable<order[]>{
    return this.http.get<order[]>(`${this.apiUrl}/getOrders/${customerId}`); 
  }

}