import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../../../core/services/listing.service';
import { Listing } from '../../../core/models/listing.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-listing-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="listing-details-wrapper" *ngIf="listing">
      <div class="info-grid">
        <div class="info-box">
          <div class="label">Title</div>
          <div>{{ listing.title }}</div>
        </div>
        <div class="info-box">
          <div class="label">Property Type</div>
          <div>{{ listing.apartmentType }}</div>
        </div>
        <div class="info-box">
          <div class="label">Number of Beds</div>
          <div>2</div>
        </div>
        <div class="info-box">
          <div class="label">Address</div>
          <div>{{ listing.address }}</div>
        </div>
        <div class="info-box">
          <div class="label">Rent</div>
          <div>
            INR {{ listing.price | number:'1.0-0' }}/month
          </div>
        </div>
        <div class="info-box desc-box">
          <div class="label">Description</div>
          <div>{{ listing.description }}</div>
        </div>
        <div class="info-box amenities-box">
          <div class="label">Amenities</div>
          <ul>
            <li *ngFor="let amenity of listing.amenities">{{ amenity }}</li>
          </ul>
        </div>
      </div>
      <div class="photos-section">
        <div class="label">Photos</div>
        <div class="photos-row">
          <div class="photo-box" *ngFor="let photo of (listing.photos && listing.photos.length ? listing.photos : [listing.imageUrl])">
            <img [src]="photo" alt="Photo" />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .listing-details-wrapper {
      max-width: 900px;
      margin: 32px auto;
      padding: 24px;
      border: 1px solid #bbb;
      border-radius: 6px;
      background: #fff;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .info-box {
      border: 2px solid #444;
      border-radius: 3px;
      padding: 10px 14px 8px 14px;
      background: #fafafa;
      min-height: 56px;
      font-size: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .label {
      font-weight: bold;
      font-size: 1rem;
      margin-bottom: 4px;
    }
    .desc-box {
      grid-column: 1 / 2;
    }
    .amenities-box {
      grid-column: 2 / 3;
    }
    .amenities-box ul {
      margin: 0;
      padding-left: 18px;
    }
    .amenities-box li {
      font-size: 0.98rem;
      margin-bottom: 2px;
    }
    .photos-section {
      margin-top: 24px;
      border: 2px solid #444;
      border-radius: 3px;
      padding: 12px 10px 18px 10px;
      background: #fafafa;
    }
    .photos-row {
      display: flex;
      gap: 18px;
      margin-top: 8px;
    }
    .photo-box {
      flex: 1;
      min-width: 120px;
      min-height: 120px;
      border: 1.5px solid #444;
      border-radius: 3px;
      background: #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      aspect-ratio: 1/1;
    }
    .photo-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `]
})
export class ListingDetailsComponent implements OnInit {
  listing: Listing | null = null;
  isOwner = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listingService: ListingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadListing(id);
    }
  }

  private loadListing(id: string): void {
    this.listingService.getListingById(id).subscribe({
      next: (listing: Listing) => {
        this.listing = listing;
        this.checkOwnership();
      },
      error: (error: Error) => {
        console.error('Error loading listing:', error);
        this.router.navigate(['/']);
      }
    });
  }

  private checkOwnership(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && this.listing) {
      this.isOwner = currentUser.id === this.listing.ownerId;
    }
  }

  onDelete(): void {
    if (this.listing && confirm('Are you sure you want to delete this listing?')) {
      this.listingService.deleteListing(this.listing.id).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error: Error) => {
          console.error('Error deleting listing:', error);
        }
      });
    }
  }
} 