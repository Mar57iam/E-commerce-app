import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';


@Component({
  selector: 'app-forgetpassword',
  imports: [RouterLink , ReactiveFormsModule],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.css',
})
export class ForgetpasswordComponent {
  step = signal<number>(1);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly requestError = signal('');
  protected readonly email = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });
  protected readonly code = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
  });
  protected readonly newPassword = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    ],
  });
  protected readonly confirmPassword = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  protected get passwordsMismatch(): boolean {
    return (
      this.confirmPassword.touched &&
      this.confirmPassword.value.length > 0 &&
      this.newPassword.value !== this.confirmPassword.value
    );
  }

  submitEmail(): void {
    this.email.markAsTouched();
    if (this.email.invalid) {
      return;
    }

    this.requestError.set('');
    this.authService.forgetPassword({ email: this.email.value }).subscribe({
      next: () => this.step.set(2),
      error: () => this.requestError.set('Could not send the code. Please try again.'),
    });
  }

  submitCode(): void {
    this.code.markAsTouched();
    if (this.code.invalid) {
      return;
    }

    this.requestError.set('');
    this.authService.verifyCode({ resetCode: this.code.value }).subscribe({
      next: () => this.step.set(3),
      error: () => this.requestError.set('The code is invalid or expired. Please try again.'),
    });
  }

  submitPassword(): void {
    this.newPassword.markAsTouched();
    this.confirmPassword.markAsTouched();
    if (this.newPassword.invalid || this.confirmPassword.invalid || this.passwordsMismatch) {
      return;
    }

    this.requestError.set('');
    this.authService
      .resetPassword({ email: this.email.value, newPassword: this.newPassword.value })
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/home']);
        },
        error: () => this.requestError.set('Could not reset your password. Please try again.'),
      });
  }
}



