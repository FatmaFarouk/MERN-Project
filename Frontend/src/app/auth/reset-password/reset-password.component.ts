import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordConfirm: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log('Token extracted from URL:', this.token);

    if (!this.token) {
      console.error('No token found in the URL.');
      alert('Invalid or missing token.');
      window.location.href = '/';
    }
  }

  get password() {
    return this.resetPasswordForm.get('password');
  }

  get passwordConfirm() {
    return this.resetPasswordForm.get('passwordConfirm');
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const passwordConfirm = formGroup.get('passwordConfirm')?.value;

    if (password !== passwordConfirm) {
      formGroup.get('passwordConfirm')?.setErrors({ mustMatch: true });
    } else {
      formGroup.get('passwordConfirm')?.setErrors(null);
    }
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const { password, passwordConfirm } = this.resetPasswordForm.value;

      console.log('Reset Password Form Submitted:', {
        token: this.token,
        password: password,
        passwordConfirm: passwordConfirm,
      });

      if (!this.token) {
        console.error('Token is undefined. Cannot proceed.');
        alert('An error occurred. Please try again.');
        return;
      }

      this.authService
        .resetPassword(this.token, password, passwordConfirm)
        .subscribe({
          next: (response) => {
            console.log('Password reset response:', response);
            Swal.fire({
              title: 'Success!',
              text: response.message || 'Password Updated successfully',
              icon: 'success',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            this.router.navigate(['/home']);
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

  // onSubmit() {
  //   if (this.resetPasswordForm.valid) {
  //     const { password, passwordConfirm } = this.resetPasswordForm.value;

  //     console.log('Reset Password Form Submitted:', {
  //       token: this.token,
  //       password: password,
  //       passwordConfirm: passwordConfirm,
  //     });

  //     if (!this.token) {
  //       console.error('Token is undefined. Cannot proceed.');
  //       alert('An error occurred. Please try again.');
  //       return;
  //     }

  //     // Send both password and passwordConfirm to the backend
  //     this.authService.resetPassword(this.token, password, passwordConfirm).subscribe(
  //       (response) => {
  //         console.log('Password reset response:', response);
  //         alert('Your password has been reset successfully.');
  //       },
  //       (error) => {
  //         console.error('Error resetting password:', error);
  //         alert('An error occurred while resetting your password. Please try again.');
  //       }
  //     );
  //   }
  // }

  // onSubmit() {
  //   if (this.resetPasswordForm.valid) {
  //     const { password } = this.resetPasswordForm.value;

  //     console.log('Reset Password Form Submitted:', {
  //       token: this.token,
  //       password: password,
  //       passwordConfirm: this.resetPasswordForm.value.passwordConfirm,
  //     });

  //     if (!this.token) {
  //       console.error('Token is undefined. Cannot proceed.');
  //       alert('An error occurred. Please try again.');
  //       return;
  //     }

  //     this.authService.resetPassword(this.token, password).subscribe(
  //       (response) => {
  //         console.log('Password reset response:', response);
  //         alert('Your password has been reset successfully.');
  //       },
  //       (error) => {
  //         console.error('Error resetting password:', error);
  //         alert('An error occurred while resetting your password. Please try again.');
  //       }
  //     );
  //   }
  // }

  // onSubmit() {
  //   if (this.resetPasswordForm.valid) {
  //     const { password } = this.resetPasswordForm.value;

  //     console.log('Reset Password Form Submitted:', {
  //       token: this.token,
  //       password: password,
  //     });

  //     if (!this.token) {
  //       console.error('Token is undefined. Cannot proceed.');
  //       alert('An error occurred. Please try again.');
  //       return;
  //     }

  //     this.authService.resetPassword(this.token, password).subscribe(
  //       (response) => {
  //         console.log('Password reset response:', response);
  //         alert('Your password has been reset successfully.');
  //       },
  //       (error) => {
  //         console.error('Error resetting password:', error);
  //         alert('An error occurred while resetting your password. Please try again.');
  //       }
  //     );
  //   }
  // }
}

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { AuthService } from '../../_services/auth.service';
// import { catchError, throwError } from 'rxjs';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-reset-password',
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './reset-password.component.html',
//   styleUrl: './reset-password.component.css'
// })
// export class ResetPasswordComponent implements OnInit {
//   resetPasswordForm: FormGroup;

//   // Token extracted from the URL path
//   token: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private route: ActivatedRoute
//   ) {
//     this.resetPasswordForm = this.fb.group(
//       {
//         password: ['', [Validators.required, Validators.minLength(6)]],
//         passwordConfirm: ['', Validators.required],
//       },
//       { validators: this.passwordMatchValidator }
//     );
//   }

//   ngOnInit(): void {
//     // Extract the token from the URL path
//     this.token = this.route.snapshot.paramMap.get('token');
//     console.log('Token extracted from URL:', this.token);

//     if (!this.token) {
//       console.error('No token found in the URL.');
//       alert('Invalid or missing token.');
//       window.location.href = '/';
//     }
//   }

//   // Getter for form controls
//   get password() {
//     return this.resetPasswordForm.get('password');
//   }

//   get passwordConfirm() {
//     return this.resetPasswordForm.get('passwordConfirm');
//   }

//   // Custom validator to ensure passwords match
//   passwordMatchValidator(formGroup: FormGroup) {
//     const password = formGroup.get('password')?.value;
//     const passwordConfirm = formGroup.get('passwordConfirm')?.value;

//     if (password !== passwordConfirm) {
//       formGroup.get('passwordConfirm')?.setErrors({ mustMatch: true });
//     } else {
//       formGroup.get('passwordConfirm')?.setErrors(null);
//     }
//   }

//   // Submit handler
//   onSubmit() {
//     if (this.resetPasswordForm.valid) {
//       const { password } = this.resetPasswordForm.value;

//       console.log('Reset Password Form Submitted:', {
//         token: this.token,
//         password: password,
//       });

//       if (!this.token) {
//         console.error('Token is undefined. Cannot proceed.');
//         alert('An error occurred. Please try again.');
//         return;
//       }

//       // Call the resetPassword method in AuthService
//       this.authService.resetPassword(this.token, password).subscribe(
//         (response) => {
//           console.log('Password reset response:', response);
//           alert('Your password has been reset successfully.');
//         },
//         (error) => {
//           console.error('Error resetting password:', error);
//           alert('An error occurred while resetting your password. Please try again.');
//         }
//       );
//     }
//   }
// }
