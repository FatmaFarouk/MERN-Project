import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from './../../_services/auth.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Success!',
            text: response.message || 'You are logged in now.',
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          console.log('User logged in successfully!', response);
          // localStorage.setItem('token' , JSON.stringify(response));
          // localStorage.setItem('token', response.token);
          // localStorage.setItem('userId', response.useId);
          // localStorage.setItem('role', response.role);r
          // let token = localStorage.getItem('token');
          console.log('User logged in successfully!', response);
          // localStorage.setItem('token', JSON.stringify(response));
          let original = response;
          const transformed = {
            status: original.status,
            token: original.token,
            userId: original.userId,
            role: original.role,
          };
          localStorage.setItem('token', JSON.stringify(transformed));
          if(response.role==='customer' || response.role == 'Customer'){
          this.router.navigate(['/home']);
        }else if(response.role==='seller' || response.role == 'Seller'){
          this.router.navigate(['/Main']);
        }else {
          this.router.navigate(['/SuperAdminAnalysis']);
        }

        },
        error: (err) => {
          Swal.fire({
            title: 'Oops...',
            text: err.message,
            icon: 'error',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        },
      });
    }
  }
  // onSubmit(): void {

  //   if (this.loginForm.valid) {
  //     this.loginForm.markAllAsTouched();
  //       return;
  //     }
  //     this.authService.login(this.loginForm.value).subscribe({
  //       next: (response) => {
  //         console.log('User logged in successfully!', response);
  //         localStorage.setItem('token' , JSON.stringify(response));
  //         let token = localStorage.getItem('token');
  //         // let role = userData ? JSON.parse(userData) : null;
  //         // console.log(role.role);
  //         // if(role.role == 'admin')
  //         // {
  //           // this.router.navigate(['/dashboard']);
  //         // }else{
  //               this.router.navigate(['/home']);
  //       //  }
  //     },
  //       error : (err) => {
  //                 Swal.fire({
  //                           icon: 'error',
  //                           title: 'error occur while signup',
  //                           text: err.message || 'An error occurred during login'
  //                 });
  //               }
  //   });
  //   }
}
