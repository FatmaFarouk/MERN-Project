import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthStaffServiceTsService } from '../../../app/_services/auth.staff.service.ts.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-slogin',
  imports: [ReactiveFormsModule],
  templateUrl: './slogin.component.html',
  styleUrl: './slogin.component.css',
})
export class SloginComponent {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthStaffServiceTsService,
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
      this.authService.slogin(this.loginForm.value).subscribe({
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
          // localStorage.setItem('stoken' , JSON.stringify(response));
          localStorage.setItem('stoken', response.stoken);
          localStorage.setItem('StaffId', response.StaffId);
          localStorage.setItem('role', response.role);
          let stoken = localStorage.getItem('stoken');
          this.router.navigate(['/cashier/getInventory']);
        },
        error: (err) =>
          Swal.fire({
            title: 'Oops...',
            text: err.message,
            icon: 'error',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          }),
      });
    }
  }
}
