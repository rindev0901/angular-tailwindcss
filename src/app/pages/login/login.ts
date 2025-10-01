import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styles: ``,
})
export class Login {
  private router = inject(Router);

  // Form fields
  protected email = '';
  protected password = '';
  protected rememberMe = false;
  protected showPassword = false;

  // UI state
  protected loading = signal(false);
  protected error = signal('');

  protected onSubmit() {
    // Reset error message
    this.error.set('');

    // Basic validation
    if (!this.email || !this.password) {
      this.error.set('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.error.set('Please enter a valid email address.');
      return;
    }

    // Set loading state
    this.loading.set(true);

    // Simulate API call
    setTimeout(() => {
      // Mock authentication logic
      if (this.email === 'admin@example.com' && this.password === 'password') {
        // Success - redirect to home or dashboard
        console.log('Login successful');
        this.router.navigate(['/']);
      } else {
        // Show error message
        this.error.set('Invalid email or password. Please try again.');
      }

      this.loading.set(false);
    }, 1500);
  }

  protected togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  protected signInWithGoogle() {
    console.log('Sign in with Google clicked');
    // Implement Google OAuth integration
    this.error.set('Google sign-in coming soon!');
  }

  protected signInWithGitHub() {
    console.log('Sign in with GitHub clicked');
    // Implement GitHub OAuth integration
    this.error.set('GitHub sign-in coming soon!');
  }

  protected navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
