import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { User } from '../_models/user';

import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient, private router: Router) {}

  signup(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, user).pipe(
      catchError((error) => {
        let errorMessage = 'An unexpected error occurred';

        // Handle specific HTTP error cases
        const errorResponse = error.error;
        if (errorResponse?.massage?.errorResponse?.code === 11000) {
          errorMessage = 'Email already exists';
        } else if (error.status === 409) {
          errorMessage = 'Email already exists';
        } else if (error.status === 500) {
          errorMessage = 'Server error, please try again later';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
  //     tap((response: any) => {
  //       console.log('Signup successful:', response);
  //       // Optionally, you can store the token or user data here
  //     }),
  //     catchError((error) => {
  //       console.error('Signup error:', error);
  //       alert('Signup failed. Please try again.');
  //       return throwError(() => new Error('Signup failed. Please try again.'));
  //     })
  //   );
  // }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      // tap((response: any) => {

      //   console.log('Login successful:', response);
      //   alert('login sucessfully')
      // }),
      catchError((error) => {
        let errorMessage = 'Login failed';
        if (error.status === 401) {
          errorMessage = 'Invalid email or password';
        }
        return throwError(() => ({
          status: error.status,
          message: errorMessage,
        }));
      })
    );
  }

  // login(credentials: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
  //     tap((response: any) => {

  //       console.log('Login successful:', response);
  //       alert('login sucessfully')
  //     }),
  //     catchError((error) => {
  //       console.error('Login error:', error);
  //       alert("wrong mail or password");
  //       return throwError(() => new Error('Login failed. Please check your credentials.'));
  //     })
  //   );
  // }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  // forgetPassword(email: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/forgetPassword`, email);
  // }

  forgetPassword(email: string): Observable<any> {
    console.log(
      'Sending reset link request to backend:',
      `${this.baseUrl}/forgetPassword`
    );
    return this.http.post(`${this.baseUrl}/forgetPassword`, { email }).pipe(
      tap((response: any) => {
        console.log('Reset link sent successfully:', response);
      }),
      catchError((error) => {
        let errorMessage = 'An unexpected error occurred';

        // Handle specific HTTP error cases
        const errorResponse = error.error;

        if (error.status === 500) {
          errorMessage = 'Email not found. Please check and try again.';
        } else if (error.status === 400) {
          errorMessage =
            'Invalid email format. Please provide a valid email address.';
        } else if (error.status === 500) {
          errorMessage = 'Server error, please try again later.';
        } else if (errorResponse?.message?.includes('email not found')) {
          errorMessage = 'Email not found. Please check and try again.';
        } else if (error.status === 404) {
          errorMessage = 'email address no found.';
        } else {
          errorMessage =
            error.message || 'Failed to send reset link. Please try again.';
        }

        console.error('Error sending reset link:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  resetPassword(
    token: string,
    password: string,
    passwordConfirm: string
  ): Observable<any> {
    console.log(
      'Sending reset password request to backend:',
      `${this.baseUrl}/resetPassword/${token}`
    );
    return this.http
      .patch(`${this.baseUrl}/resetPassword/${token}`, {
        password,
        passwordConfirm,
      })
      .pipe(
        tap((response: any) => {
          console.log('Password reset successful:', response);
        }),
        catchError((error: HttpErrorResponse) => {
          let errorMessage =
            'An unknown error occurred. Please try again later.';

          // Check if the error is an HTTP error
          if (error.error instanceof ErrorEvent) {
            // Client-side or network error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Backend error with structured response
            switch (error.status) {
              case 400:
                errorMessage =
                  error.error.message ||
                  'Bad request. Please check your input.';
                break;
              case 401:
                errorMessage =
                  error.error.message || 'Invalid or expired token.';
                break;
              case 500:
                errorMessage =
                  error.error.message ||
                  'Internal server error. Please try again later.';
                break;
              default:
                errorMessage =
                  error.error.message ||
                  `Error ${error.status}: An unexpected error occurred.`;
            }
          }
          console.error('Error resetting password:', errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  // resetPassword(data: { token: string; password: string }): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/resetPassword`, data).pipe(
  //     catchError((error) => {
  //       console.error('Error resetting password:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

  private currentUser: User | null = null;

  setCurrentUser(user: User): void {
    this.currentUser = user;
  }

  getCurrentUserId(): string {
    return this.currentUser?._id || '';
  }
}
