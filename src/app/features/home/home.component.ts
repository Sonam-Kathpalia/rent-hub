import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ListingService } from '../../core/services/listing.service';
import { Listing } from '../../core/models/listing.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-wrapper">
      <div class="top-section">
        <div class="carousel-container">
          <div class="carousel">
            <button class="carousel-arrow left" (click)="prevFeatured()">&#60;</button>
            <img *ngIf="featuredListings.length" [src]="featuredListings[featuredIndex].imageUrl" alt="Featured" class="carousel-image" />
            <button class="carousel-arrow right" (click)="nextFeatured()">&#62;</button>
          </div>
        </div>
        <div class="featured-card" *ngIf="featuredListings.length">
          <h3>Featured Listings</h3>
          <div class="listing-address">{{ featuredListings[featuredIndex].address }}</div>
          <p>{{ featuredListings[featuredIndex].description }}</p>
          <div class="featured-actions">
            <button class="btn-outline" (click)="onViewFeaturedDetails()">View Details</button>
            <button class="btn-outline" (click)="onComment(featuredListings[featuredIndex])">Comment</button>
            <button class="btn-outline favorite-btn" [ngClass]="{ 'favorited': isListingFavorited(featuredListings[featuredIndex].id) }" (click)="onToggleFavorite(featuredListings[featuredIndex], $event)"
              [attr.title]="isListingFavorited(featuredListings[featuredIndex].id) ? 'Unmark it as Favorite' : 'Mark it as favorite'">
              <span [ngStyle]="{ color: isListingFavorited(featuredListings[featuredIndex].id) ? 'red' : '#888', 'font-size': '1.4em' }">
                {{ isListingFavorited(featuredListings[featuredIndex].id) ? '♥' : '♡' }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <h2 class="all-listings-title">All Listings</h2>
      <div class="listings-grid">
        <div *ngFor="let listing of listings" class="listing-card">
          <div class="image-container">
            <img [src]="listing.imageUrl" [alt]="listing.title" class="listing-image" />
          </div>
          <div class="listing-content">
            <h3>{{ listing.title }}</h3>
            <div class="listing-address">{{ listing.address }}</div>
            <p>{{ listing.description }}</p>
            <div class="listing-actions">
              <button class="btn-outline" [routerLink]="['/listings', listing.id]">View Details</button>
              <button class="btn-outline" (click)="onComment(listing)">Comment</button>
              <button class="btn-outline favorite-btn" [ngClass]="{ 'favorited': isListingFavorited(listing.id) }" (click)="onToggleFavorite(listing, $event)"
                [attr.title]="isListingFavorited(listing.id) ? 'Unmark it as Favorite' : 'Mark it as favorite'">
                <span [ngStyle]="{ color: isListingFavorited(listing.id) ? 'red' : '#888', 'font-size': '1.4em' }">
                  {{ isListingFavorited(listing.id) ? '♥' : '♡' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 16px;
    }
    .top-section {
      display: flex;
      gap: 32px;
      margin-bottom: 40px;
    }
    .carousel-container {
      flex: 2;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .carousel {
      position: relative;
      width: 100%;
      max-width: 600px;
      height: 260px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      overflow: hidden;
    }
    .carousel-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
    .carousel-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: white;
      border: 1px solid #ccc;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      font-size: 20px;
      cursor: pointer;
      z-index: 2;
      transition: background 0.2s;
    }
    .carousel-arrow.left { left: 12px; }
    .carousel-arrow.right { right: 12px; }
    .carousel-arrow:hover { background: #eee; }

    .featured-card {
      flex: 1;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 260px;
      max-width: 320px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
    }
    .featured-card h3 {
      margin: 0 0 12px 0;
      font-size: 1.2rem;
      font-weight: bold;
    }
    .featured-card p {
      font-size: 0.98rem;
      color: #444;
      margin-bottom: 18px;
    }
    .featured-actions {
      display: flex;
      gap: 10px;
    }
    .btn-outline {
      border: 1px solid #888;
      background: #fff;
      color: #222;
      padding: 6px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s, border 0.2s;
    }
    .btn-outline:hover {
      background: #f0f0f0;
      border-color: #333;
    }
    .all-listings-title {
      font-size: 2rem;
      font-weight: bold;
      margin: 32px 0 24px 0;
    }
    .listings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 28px;
    }
    .listing-card {
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
    }
    .image-container {
      width: 100%;
      height: 220px;
      overflow: hidden;
      background: #f5f5f5;
    }
    .listing-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }
    .listing-image:hover {
      transform: scale(1.04);
    }
    .listing-content {
      padding: 18px 16px 16px 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .listing-content h3 {
      margin: 0 0 10px 0;
      font-size: 1.1rem;
      font-weight: bold;
    }
    .listing-content p {
      font-size: 0.97rem;
      color: #444;
      margin-bottom: 18px;
    }
    .listing-actions {
      display: flex;
      gap: 10px;
      margin-top: auto;
    }
    .btn-outline.favorited {
      border-color: #e67e22;
      color: #e67e22;
      font-weight: bold;
      background: #fffbe6;
    }
    .favorite-btn {
      border: none;
      background: transparent;
      box-shadow: none;
      padding: 0 8px;
      cursor: pointer;
      transition: color 0.2s;
    }
    .favorite-btn.favorited span {
      color: red !important;
    }
    .listing-address {
      font-size: 0.97rem;
      color: #666;
      margin-bottom: 6px;
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  listings: Listing[] = [];
  featuredListings: Listing[] = [];
  featuredIndex: number = 0;
  currentUser: any = null;
  private userSub: any;

  constructor(private listingService: ListingService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.loadListings();
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  loadListings(): void {
    this.listingService.getListings().subscribe({
      next: (listings) => {
        this.listings = listings;
        this.featuredListings = listings.slice(0, 2); // Show only 2 as featured
      },
      error: (error) => {
        console.error('Error loading listings:', error);
      }
    });
  }

  prevFeatured() {
    this.featuredIndex = (this.featuredIndex - 1 + this.featuredListings.length) % this.featuredListings.length;
  }

  nextFeatured() {
    this.featuredIndex = (this.featuredIndex + 1) % this.featuredListings.length;
  }

  isListingFavorited(listingId: string): boolean {
    if (!this.currentUser || !this.currentUser.favorites) return false;
    return this.currentUser.favorites.includes(listingId);
  }

  onToggleFavorite(listing: Listing, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.authService.isAuthenticated()) {
      window.alert('Please login if you want to mark it as favourite.');
      return;
    }
    this.listingService.toggleFavorite(listing.id, this.currentUser.id).subscribe({
      next: (res: any) => {
        this.currentUser.favorites = res.favorites;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
      }
    });
  }

  onViewFeaturedDetails() {
    const featured = this.featuredListings[this.featuredIndex];
    if (featured) {
      this.router.navigate(['/listings', featured.id]);
    }
  }

  onComment(listing: Listing) {
    this.router.navigate(['/listings', listing.id, 'comments']);
  }
} 