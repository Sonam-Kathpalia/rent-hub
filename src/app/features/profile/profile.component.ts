import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';
import { Listing } from '../../core/models/listing.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="profile-section">
        <h2>My Profile</h2>
        
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input 
              id="fullName" 
              type="text" 
              formControlName="fullName" 
              class="form-control"
            >
            <div class="error" *ngIf="submitted && profileForm.get('fullName')?.errors">
              <div *ngIf="profileForm.get('fullName')?.errors?.['required']">
                Full name is required
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email" 
              class="form-control"
              [readonly]="true"
            >
          </div>

          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input 
              id="phone" 
              type="tel" 
              formControlName="phone" 
              class="form-control"
            >
            <div class="error" *ngIf="submitted && profileForm.get('phone')?.errors">
              <div *ngIf="profileForm.get('phone')?.errors?.['pattern']">
                Please enter a valid phone number
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Role</label>
            <div class="role-display">
              {{ profileForm.get('role')?.value || 'User' }}
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="save-btn">Save Changes</button>
          </div>
        </form>
      </div>

      <div class="listings-section" *ngIf="userListings.length > 0">
        <h3>My Listings</h3>
        <div class="listings-grid">
          <div class="listing-card" *ngFor="let listing of userListings">
            <div class="image-container">
              <img [src]="listing.imageUrl" [alt]="listing.title">
            </div>
            <div class="listing-details">
              <h4>{{ listing.title }}</h4>
              <p class="price">INR {{ listing.price | number:'1.0-0' }}/month</p>
              <p class="location">{{ listing.location }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .profile-section {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }

    h2 {
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

      &[readonly] {
        background-color: #f5f5f5;
        cursor: not-allowed;
      }
    }

    .error {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 4px;
    }

    .role-display {
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
      color: #666;
    }

    .form-actions {
      margin-top: 30px;
    }

    .save-btn {
      background: #2ecc71;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background: #27ae60;
      }
    }

    .listings-section {
      margin-top: 40px;
    }

    .listings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .listing-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);

      &:hover {
        transform: translateY(-5px);
      }

      .image-container {
        width: 100%;
        height: 160px;
        overflow: hidden;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }
      }

      .listing-details {
        padding: 15px;

        h4 {
          margin: 0 0 10px;
          font-size: 1.1rem;
          color: #333;
        }

        .price {
          color: #2ecc71;
          font-weight: bold;
          font-size: 1.2rem;
          margin: 5px 0;
        }

        .location {
          color: #666;
          font-size: 0.9rem;
        }
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  submitted = false;
  userListings: Listing[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9-+()]*$')]],
      role: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          fullName: user.fullName || '',
          email: user.email,
          phone: user.phone || '',
          role: user.role || 'user'
        });
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.profileForm.valid) {
      const updatedUser: Partial<User> = {
        fullName: this.profileForm.value.fullName,
        phone: this.profileForm.value.phone
      };

      // TODO: Implement update profile service method
      console.log('Profile update:', updatedUser);
    }
  }
} 