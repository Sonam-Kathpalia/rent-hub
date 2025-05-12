import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers: [FormBuilder],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input 
              id="fullName" 
              type="text" 
              formControlName="fullName" 
              class="form-control"
              placeholder="Enter your full name"
            >
            <div class="error" *ngIf="submitted && registerForm.get('fullName')?.errors">
              <div *ngIf="registerForm.get('fullName')?.errors?.['required']">Full name is required</div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email" 
              class="form-control"
              placeholder="Enter your email"
            >
            <div class="error" *ngIf="submitted && registerForm.get('email')?.errors">
              <div *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</div>
              <div *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email</div>
            </div>
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input 
              id="phone" 
              type="tel" 
              formControlName="phone" 
              class="form-control"
              placeholder="Enter your phone number"
            >
            <div class="error" *ngIf="submitted && registerForm.get('phone')?.errors">
              <div *ngIf="registerForm.get('phone')?.errors?.['pattern']">Please enter a valid phone number</div>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password" 
              class="form-control"
              placeholder="Enter your password"
            >
            <div class="error" *ngIf="submitted && registerForm.get('password')?.errors">
              <div *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</div>
              <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</div>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword" 
              type="password" 
              formControlName="confirmPassword" 
              class="form-control"
              placeholder="Confirm your password"
            >
            <div class="error" *ngIf="submitted && registerForm.get('confirmPassword')?.errors">
              <div *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</div>
              <div *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']">Passwords do not match</div>
            </div>
          </div>

          <div class="form-group">
            <label>Role</label>
            <div class="radio-group">
              <label>
                <input type="radio" formControlName="role" value="user"> User
              </label>
              <label>
                <input type="radio" formControlName="role" value="landlord"> Landlord
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn">Register</button>
          </div>

          <div class="auth-links">
            <p>Already have an account? <a [routerLink]="['/login']">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .auth-card {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #666;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;

      &:focus {
        outline: none;
        border-color: #3498db;
      }
    }

    .error {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 4px;
    }

    .radio-group {
      display: flex;
      gap: 20px;

      label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }
    }

    .form-actions {
      margin-top: 30px;
    }

    .submit-btn {
      width: 100%;
      padding: 12px;
      background: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background: #27ae60;
      }
    }

    .auth-links {
      text-align: center;
      margin-top: 20px;

      a {
        color: #3498db;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9-+()]*$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['user']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.registerForm.reset();
    this.registerForm.patchValue({ role: 'user' });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value;
      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Registration error:', error);
          // Handle registration error (show message to user)
        }
      });
    }
  }
} 