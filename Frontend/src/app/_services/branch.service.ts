import { Injectable } from '@angular/core';
import { Inventory } from '../_models/Inventory';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { internalOrder } from '../_models/internalOrder';
import { Product } from '../_models/product';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  branches:Inventory[]=[];

  private apiUrl='http://localhost:3000/branch/'
  constructor(private http: HttpClient) { }

  getAllBranches():Observable<Inventory[]>{
    
    return this.http.get<Inventory[]>(this.apiUrl+"getAllbranches");
  }

  setInternalorder(orderData: any): Observable<any> {
    // Define the request headers (if needed)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Define the request body
    const body = JSON.stringify(orderData);

    // Send the POST request
    return this.http.post(`${this.apiUrl}addIntervalorder`, body, { headers });
  }

  getAllorders(user:string):Observable<internalOrder[]>{

    const params = new HttpParams().set('userId', user);
    return this.http.get<internalOrder[]>(`${this.apiUrl}getallclerkorders/${user}`)
  }
  getAllProducts(BranchId:string):Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}getBranchProduct/${BranchId}`);
  }
  
  getProductsInbranch(BranchId:string):Observable<Product[]>{

    return this.http.get<Product[]>(`${this.apiUrl}getProdInBranch/${BranchId}`);
  }
}
