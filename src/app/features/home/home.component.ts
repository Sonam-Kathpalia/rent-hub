import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ListingService } from '../../core/services/listing.service';
import { Listing } from '../../core/models/listing.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ]
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
        console.log('All listings loaded:', listings);
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

  getDisplayImage(listing: any): string | null {
    if (!listing.photos || !listing.photos.length) {
      console.log(`Listing ${listing.id} has no photos`);
      return null;
    }
    
    console.log(`Listing ${listing.id} photos:`, listing.photos);
    
    // First, try to find an image with 'front' in the name
    const frontImage = listing.photos.find((photo: string) => {
      const photoLower = photo.toLowerCase();
      const isFront = photoLower.includes('front');
      console.log(`Checking photo ${photo}: isFront = ${isFront}`);
      return isFront;
    });
    
    console.log(`Selected image for listing ${listing.id}:`, frontImage || listing.photos[0]);
    
    // If no front image found, return the first image
    return frontImage || listing.photos[0];
  }
} 