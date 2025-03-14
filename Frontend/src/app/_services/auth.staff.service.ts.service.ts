import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStaffServiceTsService {
  private baseUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private router: Router) {}
  ssignup(staff: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ssignup`, staff).pipe(
      tap((response: any) => {
        console.log('Signup successful:', response);
        // Optionally, you can store the token or user data here
      }),
      catchError((error) => {
        console.error('Signup error:', error);
        alert('Signup failed. Please try again.');
        return throwError(() => new Error('Signup failed. Please try again.'));
      })
    );
  }

  slogin(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/slogin`, credentials).pipe(
      tap((response: any) => {
        console.log('Login successful:', response);
        alert('login sucessfully');
      }),
      catchError((error) => {
        console.error('Login error:', error);
        alert('wrong mail or password');
        return throwError(
          () => new Error('Login failed. Please check your credentials.')
        );
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('stoken');
  }

  logout() {
    localStorage.removeItem('stoken');
    this.router.navigate(['/slogin']);
  }
}
