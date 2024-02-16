import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SignInComponent {
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(username: string, password: string): void {
    // Form validation
    if (!username || !password) {
      this.errorMessage = 'Please enter both username and password.';
      alert(this.errorMessage);
      return;
    }

    // Call API for Sign In
    this.authService.signIn(username, password).subscribe(
      (token: string) => {
        // Login success
        this.authService.setToken(token);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        // Handle authentication error
        this.errorMessage = 'Invalid username or password. Please try again.';
        alert(this.errorMessage);
      }
    );
  }
}
