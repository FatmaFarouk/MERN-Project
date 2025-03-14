import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from './../../_services/auth.service';
import { Route, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  role=""
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        firstName: [
          '',
          [Validators.required, Validators.pattern(/^[A-Za-z\s'-]+$/)],
        ],
        lastName: [
          '',
          [Validators.required, Validators.pattern(/^[A-Za-z\s'-]+$/)],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
          ],
        ],
        passwordConfirm: ['', [Validators.required]],
        role: ['customer', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');
    return password &&
      passwordConfirm &&
      password.value !== passwordConfirm.value
      ? { passwordMismatch: true }
      : null;
  };

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.authService.signup(this.signupForm.value).subscribe({
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
        // localStorage.setItem('token', response.token);
        // localStorage.setItem('userId', response.data.newUser._id);
        // localStorage.setItem('role', response.data.newUser.role);
         console.log('User logged in successfully!', response);
        // localStorage.setItem('token', JSON.stringify(response));
        let original = response;
        const transformed = {
          status: original.status,
          token: original.token,
          userId: original.data.newUser._id,
          role: original.data.newUser.role,
        };
        localStorage.setItem('token', JSON.stringify(transformed));

        if(response.data.newUser.role==='customer' || response.data.newUser.role == 'Customer'){
        this.router.navigate(['/home']);
      }else if(response.data.newUser.role==='seller' || response.data.newUser.role == 'Seller'){
        this.router.navigate(['/Main/profile']);
      }else {
        this.router.navigate(['/SuperAdminAnalysis']);
      }

        // this.router.navigate(['/home']);
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
