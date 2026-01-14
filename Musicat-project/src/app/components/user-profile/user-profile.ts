import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfileComponent implements OnInit {
  isLoggedIn = false;
  currentUser: User | null = null;
  isSignupMode = false;

  // Form fields
  username = '';
  password = '';
  email = '';
  name = '';
  confirmPassword = '';

  error: string | null = null;
  loading = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getUserFromLocalStorage();
    this.isLoggedIn = !!this.currentUser;
  }

  toggleMode() {
    this.isSignupMode = !this.isSignupMode;
    this.resetForm();
  }

  resetForm() {
    this.username = '';
    this.password = '';
    this.email = '';
    this.name = '';
    this.confirmPassword = '';
    this.error = null;
  }

  async login() {
    if (!this.username || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const user = await this.authService.login(this.username, this.password);
      this.currentUser = user;
      this.authService.saveUserToLocalStorage(user);
      this.isLoggedIn = true;
      this.resetForm();
    } catch (err: any) {
      this.error = err.message || 'Login failed';
    } finally {
      this.loading = false;
    }
  }

  async signup() {
    if (!this.username || !this.password || !this.email || !this.name) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const user = await this.authService.signup(
        this.name,
        this.email,
        this.username,
        this.password
      );
      this.currentUser = user;
      this.authService.saveUserToLocalStorage(user);
      this.isLoggedIn = true;
      this.resetForm();
      this.isSignupMode = false;
    } catch (err: any) {
      this.error = err.message || 'Signup failed';
    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.authService.logout();
    this.currentUser = null;
    this.isLoggedIn = false;
    this.resetForm();
  }
}

