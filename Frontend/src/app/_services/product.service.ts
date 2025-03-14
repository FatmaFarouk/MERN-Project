import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap,filter } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../_models/product';
import {GettokensellerService} from '../_services/gettokenseller.service';
import {SellerauthaddService} from '../_services/sellerauthadd.service';


@Injectable({ 
  providedIn: 'root'
})

export class ProductService { 

  constructor(private http: HttpClient,private getData:GettokensellerService,private sellerauthaddService:SellerauthaddService) { }

  private url: string = "http://localhost:3000/seller";

  // list products 
  getAll():Observable<Product[]> {
    return this.http.get<Product[]>(`${this.url}/onlineProducts`);
  }
  
  // get filtered products
  getFilteredProducts(category: string, search: string = '', minPrice: number | null = null, maxPrice: number | null = null): Observable<Product[]> {
    let params = new HttpParams();

    if (category) params = params.set('category', category);
    if (search) params = params.set('search', search);
    if (minPrice !== null) params = params.set('minPrice', minPrice.toString());
    if (maxPrice !== null) params = params.set('maxPrice', maxPrice.toString());

    return this.http.get<Product[]>(`${this.url}/filteredProducts`, { params });
  }

  //get product by id
  getProductById(id: string) {
    return this.http.get<Product>(`${this.url}/products/${id}`);

  }


  //Era product sevice
  private apiUrl="http://localhost:3000/seller";
  private productsSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productsSubject.asObservable();
  
  getProducts(sellerId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/seller/${sellerId}`, {
      headers: new HttpHeaders(this.getData.getAuthHeaders()),
      params: { '_t': Date.now() } // Cache buster
    }).pipe(
      tap(data => this.productsSubject.next(data as Product[]))
    );
  }
  
  DeleteProduct(productId: any) {
    return this.http.delete(`${this.apiUrl}/products/${productId}`, {
      headers: new HttpHeaders(this.getData.getAuthHeaders()),
    });
  }
  
  addProduct(formData: FormData): Observable<any> {
    // Extract and parse the sellerInfo field from formData
    const sellerInfoString = formData.get('sellerInfo') as string; // Get sellerInfo as string
    let sellerId: string | null = null;

    if (sellerInfoString) {
      try {
        const sellerInfo = JSON.parse(sellerInfoString); // Convert string to object
        sellerId = sellerInfo.id; // Extract sellerId
        console.log('Seller ID:', sellerId);
      } catch (error) {
        console.error('Error parsing sellerInfo:', error);
      }
    }

    return this.http.post(`${this.apiUrl}/products`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      // tap(() => {
      //   if (sellerId) {
      //     this.getProducts(sellerId).subscribe(); // Refresh list after addition
      //   }
      // })
      filter(event => event.type === 4),
      tap(() => setTimeout(() => this.getProducts(sellerId).subscribe(), 500))
    );
}

  
  // Update product stock
  updateStock(productId: string, quantity: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/products/${productId}/stock`, { quantity }, );
  }

  getUserNameById(id: string): Observable<any> {
    const baseUrl = 'http://localhost:3000/users';
    return this.http.patch<any>(`${baseUrl}/getuserByid`, { id });
  }
  
  
} 
