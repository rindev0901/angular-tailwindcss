import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal, inject, computed } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

// Define the form structure type
interface ILoginFormValue {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface IUIState {
  isLoading: boolean;
  errMessage: string;
  showPassword: boolean;
}

type LoginFormField = keyof ILoginFormValue;

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);

  protected loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  // UI state signals
  protected uiState = signal<IUIState>({
    isLoading: false,
    errMessage: '',
    showPassword: false,
  });

  protected loading = computed(() => this.uiState().isLoading);
  protected error = computed(() => this.uiState().errMessage);
  protected showPassword = computed(() => this.uiState().showPassword);

  protected onSubmit() {
    if (this.loginForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
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
    this.uiState.update((state) => ({ ...state, isLoading: true, errMessage: '' }));

    // Show loading toast
    const loadingToast = this.toastr.info('Logging into your account...', 'Please Wait', {
      timeOut: 0,
      extendedTimeOut: 0,
      progressBar: false,
      tapToDismiss: false,
      closeButton: false,
    });

    // Get form values
    const formValue = this.loginForm.value;

    this.authService
      .loginEmail({
        email: formValue.email!,
        password: formValue.password!,
        rememberMe: formValue.rememberMe!,
      })
      .subscribe({
        next: (response) => {
          // Clear the loading toast
          loadingToast.toastRef.close();

          // Success - login completed
          this.uiState.update((state) => ({ ...state, isLoading: false, errMessage: '' }));

          this.toastr.success(
            `Welcome back, ${formValue.email}! You have logged in successfully.`,
            'Login Successful!',
            {
              timeOut: 4000,
              progressBar: true,
            }
          );
          // Redirect to login page after success
          this.router.navigate(['/']);
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
          this.uiState.update((state) => ({ ...state, isLoading: false }));
        },
      });
  }

  private getFieldDisplayName(fieldName: LoginFormField): string {
    const displayNames: Record<LoginFormField, string> = {
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember Me',
    };
    return displayNames[fieldName] || fieldName;
  }

  protected getFieldError(fieldName: LoginFormField): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.touched || !field.errors) return '';

    const errors = field.errors;
    const fieldDisplayName = this.getFieldDisplayName(fieldName);

    if (errors['required']) return `${fieldDisplayName} is required.`;
    if (errors['email']) return 'Please enter a valid email address.';

    return '';
  }

  protected hasFieldError(fieldName: LoginFormField): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  protected togglePasswordVisibility() {
    this.uiState.update((state) => ({ ...state, showPassword: !state.showPassword }));
  }

  protected signInWithGoogle() {
    // Implement Google OAuth integration
    this.toastr.warning('Google sign-in coming soon!');
  }

  protected signInWithGitHub() {
    // Implement GitHub OAuth integration
    this.toastr.warning('GitHub sign-in coming soon!');
  }

  protected navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
