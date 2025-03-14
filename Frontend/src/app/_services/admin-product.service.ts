import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminProduct } from '../_models/admin-product'; // Update this path
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminProductService {
  private apiUrl = 'http://localhost:3000/inbranch';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<AdminProduct[]> {
    return this.http.get<AdminProduct[]>(`${this.apiUrl}/products`);
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${productId}`);
  }

  updateProduct(
    productId: string,
    data: { price: number; stockQuantity: number }
  ): Observable<AdminProduct> {
    return this.http.put<AdminProduct>(
      `${this.apiUrl}/products/${productId}`,
      data
    );
  }

  createProduct(product: AdminProduct): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(`${this.apiUrl}/products`, product);
  }

  // createProduct(product: AdminProduct): Observable<AdminProduct> {
  //   return this.http.post<AdminProduct>(`${this.apiUrl}/products`, product);
  // }

  // updateProduct(
  //   productId: string,
  //   product: AdminProduct
  // ): Observable<AdminProduct> {
  //   return this.http.put<AdminProduct>(
  //     `${this.apiUrl}/products/${productId}`,
  //     product
  //   );
  // }
}
