import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class getData  {

  constructor() { }
//helper function
  private getStoredData(): any {
    const storedData = localStorage.getItem('stoken');
    if (!storedData) {
      return null;
    }
    return storedData;
  }

  //get customer id
//   getCustomerId(): string | null {
//     const data = this.getStoredData();
//     return data ? data.userId : null;
//   }

 //get token just put it in header
  getAuthHeaders(): any {
    const data = this.getStoredData();
    if (!data) {
      throw new Error("No token found in localStorage.");
    }

    return {
      'Authorization': `Bearer ${data}`,
      'Content-Type': 'application/json'
    };
  }
}
