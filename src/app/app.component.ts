import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { User } from './core/models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <button mat-button routerLink="/" class="home-button">
        <span>🏠 Rent-Hub</span>
      </button>
      <span class="spacer"></span>
      
      <ng-container *ngIf="currentUser; else authButtons">
        <span class="user-info">
          Welcome, {{ currentUser.fullName }}
          <span class="user-role">({{ currentUser.role }})</span>
        </span>
        <button *ngIf="currentUser.role === 'landlord'" mat-button routerLink="/listings/create">Create Listing</button>
        <button mat-button routerLink="/profile">Profile</button>
        <button mat-button (click)="logout()">Logout</button>
      </ng-container>
      
      <ng-template #authButtons>
        <button mat-button routerLink="/login">Login</button>
        <button mat-button routerLink="/register">Register</button>
      </ng-template>
    </mat-toolbar>

    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .container {
      padding: 20px;
    }
    .user-info {
      margin-right: 16px;
      font-size: 14px;
    }
    .user-role {
      font-size: 12px;
      opacity: 0.8;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'rent-hub';
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
