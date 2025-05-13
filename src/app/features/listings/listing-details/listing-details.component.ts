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
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.scss']
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
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadListing(id);
      }
    });
  }

  loadListing(id: string): void {
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