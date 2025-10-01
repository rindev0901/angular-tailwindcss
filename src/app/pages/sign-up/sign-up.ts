import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal, inject, computed } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styles: ``,
})
export class SignUp {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);

  confirmPasswordValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.parent) return null;

    const password = control.parent.get('password')?.value;
    const confirmPassword = control.value;

    if (!password || !confirmPassword) return null;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // Reactive Form
  protected signUpForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-Z\s]+$/),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required, this.confirmPasswordValidator]),
    agreeToTerms: new FormControl(false, [Validators.requiredTrue]),
  });

  constructor() {
    // Subscribe to password changes to update the signal
    this.password?.valueChanges.subscribe((value) => {
      this.passwordValue.set(value || '');
    });
  }

  // UI state
  protected uiState = signal({
    loading: false,
    success: '',
    showPassword: false,
    showConfirmPassword: false,
  });

  // Form field getters
  get fullName() {
    return this.signUpForm.get('fullName');
  }
  get email() {
    return this.signUpForm.get('email');
  }
  get password() {
    return this.signUpForm.get('password');
  }
  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }
  get agreeToTerms() {
    return this.signUpForm.get('agreeToTerms');
  }

  // Password strength signal that tracks form control changes
  protected passwordValue = signal('');

  // Password strength computed values
  protected passwordStrength = computed(() => {
    const password = this.passwordValue();
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  });

  protected passwordStrengthBars = computed(() => {
    const strength = this.passwordStrength();
    const bars = [];

    for (let i = 0; i < 5; i++) {
      if (i < strength) {
        if (strength <= 2) bars.push('bg-red-400');
        else if (strength <= 3) bars.push('bg-yellow-400');
        else bars.push('bg-green-400');
      } else {
        bars.push('bg-gray-200');
      }
    }

    return bars;
  });

  protected passwordStrengthText = computed(() => {
    const strength = this.passwordStrength();
    if (!this.passwordValue()) return '';

    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[strength - 1] || 'Very Weak';
  });

  protected passwordStrengthColor = computed(() => {
    const strength = this.passwordStrength();
    if (strength <= 2) return 'text-red-600';
    if (strength <= 3) return 'text-yellow-600';
    return 'text-green-600';
  });

  // Helper methods for template access
  protected loading = () => this.uiState().loading;
  protected success = () => this.uiState().success;

  // Error message helpers for each field
  protected getFieldError(fieldName: string): string {
    const field = this.signUpForm.get(fieldName);
    if (!field || !field.touched || !field.errors) return '';

    const errors = field.errors;
    const fieldDisplayName = this.getFieldDisplayName(fieldName);

    if (errors['required']) return `${fieldDisplayName} is required.`;
    if (errors['minlength'])
      return `${fieldDisplayName} must be at least ${errors['minlength'].requiredLength} characters.`;
    if (errors['email']) return 'Please enter a valid email address.';
    if (errors['pattern']) return `${fieldDisplayName} contains invalid characters.`;
    if (errors['passwordMismatch']) return 'Passwords do not match.';
    if (errors['requiredTrue']) return 'Please agree to the Terms of Service and Privacy Policy.';
    if (errors['emailExists'])
      return 'This email is already registered. Please use a different email.';

    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      fullName: 'Full name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      agreeToTerms: 'Terms agreement',
    };
    return displayNames[fieldName] || fieldName;
  }

  protected hasFieldError(fieldName: string): boolean {
    const field = this.signUpForm.get(fieldName);
    return !!(field && field.touched && field.errors);
  }

  protected onSubmit() {
    if (this.signUpForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.signUpForm.markAllAsTouched();
      this.toastr.error(
        'Please fix the errors in the form before submitting.',
        'Form Validation Error',
        {
          timeOut: 5000,
          progressBar: true,
        }
      );
      return;
    }

    // Set loading state
    this.uiState.update((state) => ({ ...state, loading: true }));

    // Show loading toast
    const loadingToast = this.toastr.info('Creating your account...', 'Please Wait', {
      timeOut: 0,
      extendedTimeOut: 0,
      progressBar: false,
      tapToDismiss: false,
      closeButton: false,
    });

    // Get form values
    const formValue = this.signUpForm.value;

    this.authService
      .registerEmail({
        email: formValue.email!,
        name: formValue.fullName!,
        password: formValue.password!,
      })
      .subscribe({
        next: (response) => {
          // Clear the loading toast
          loadingToast.toastRef.close();

          // Success - registration completed
          this.uiState.update((state) => ({ ...state, loading: false }));

          this.toastr.success(
            `Welcome aboard, ${formValue.fullName}! Your account has been created successfully. Redirecting you to the login page...`,
            'Account Created!',
            {
              timeOut: 4000,
              progressBar: true,
            }
          );
          // Redirect to login page after success
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          // Clear the loading toast
          loadingToast.toastRef.close();

          if (err instanceof HttpErrorResponse) {
            this.toastr.error(err.error?.message || 'Unknown error', err.error?.code, {
              timeOut: 6000,
              progressBar: true,
            });
          } else {
            this.toastr.error('An unexpected error occurred. Please try again.', 'Error', {
              timeOut: 6000,
              progressBar: true,
            });
          }

          // Reset loading state
          this.uiState.update((state) => ({ ...state, loading: false }));
        },
      });
  }

  protected togglePasswordVisibility() {
    this.uiState.update((state) => ({ ...state, showPassword: !state.showPassword }));
  }

  protected toggleConfirmPasswordVisibility() {
    this.uiState.update((state) => ({ ...state, showConfirmPassword: !state.showConfirmPassword }));
  }

  protected signUpWithGoogle() {
    console.log('Sign up with Google clicked');
    // You can implement Google OAuth integration here
  }

  protected signUpWithGitHub() {
    console.log('Sign up with GitHub clicked');
    // You can implement GitHub OAuth integration here
  }
}
