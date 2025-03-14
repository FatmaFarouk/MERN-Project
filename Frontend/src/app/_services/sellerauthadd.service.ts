import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SellerauthaddService {

  constructor() { }
//helper function
  private getStoredData(): any {
    const storedData = localStorage.getItem('token');
    if (!storedData) {
      return null;
    }
    return storedData;
  }

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

 
  getAuthHeaders(): HttpHeaders { 
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("No token found in localStorage.");
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
