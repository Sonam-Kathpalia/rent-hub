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
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
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