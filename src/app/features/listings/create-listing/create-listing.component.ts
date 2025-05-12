import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../../../core/services/listing.service';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card" style="max-width: 700px;">
        <h2 *ngIf="!previewMode">Create New Listing</h2>
        <form *ngIf="!previewMode" [formGroup]="listingForm" (ngSubmit)="onPreview()">
          <!-- Property Type -->
          <div class="form-group">
            <label for="apartmentType">Property Type</label>
            <select id="apartmentType" formControlName="apartmentType" class="form-control">
              <option value="">Select an option</option>
              <option value="Apartment">Apartment</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Studio">Studio</option>
              <option value="Building">Building</option>
            </select>
            <div class="error" *ngIf="submitted && listingForm.get('apartmentType')?.errors">
              <div *ngIf="listingForm.get('apartmentType')?.errors?.['required']">Please select an option</div>
            </div>
          </div>
          <!-- Title of the property -->
          <div class="form-group">
            <label for="propertyTitle">Title of the property</label>
            <input id="propertyTitle" type="text" formControlName="propertyTitle" class="form-control" placeholder="Enter title" />
            <div class="error" *ngIf="submitted && listingForm.get('propertyTitle')?.errors">
              <div *ngIf="listingForm.get('propertyTitle')?.errors?.['required']">Title is required</div>
            </div>
          </div>
          <!-- Number of Beds -->
          <div class="form-group">
            <label for="numberOfBeds">Number of Beds</label>
            <input id="numberOfBeds" type="number" formControlName="numberOfBeds" class="form-control" min="1" placeholder="Enter number of beds">
            <div class="error" *ngIf="submitted && listingForm.get('numberOfBeds')?.errors">
              <div *ngIf="listingForm.get('numberOfBeds')?.errors?.['required']">Number of beds is required</div>
              <div *ngIf="listingForm.get('numberOfBeds')?.errors?.['min']">Must be at least 1</div>
            </div>
          </div>
          <!-- Address -->
          <div class="form-group">
            <label for="streetAddress">Address</label>
            <input id="streetAddress" type="text" formControlName="streetAddress" class="form-control" placeholder="Enter address">
            <div class="error" *ngIf="submitted && listingForm.get('streetAddress')?.errors">
              <div *ngIf="listingForm.get('streetAddress')?.errors?.['required']">Address is required</div>
            </div>
          </div>
          <!-- Rent -->
          <div class="form-group">
            <label for="expectedRent">Rent (per month)</label>
            <input id="expectedRent" type="number" formControlName="expectedRent" class="form-control" placeholder="Enter rent">
            <div class="error" *ngIf="submitted && listingForm.get('expectedRent')?.errors">
              <div *ngIf="listingForm.get('expectedRent')?.errors?.['required']">Rent is required</div>
              <div *ngIf="listingForm.get('expectedRent')?.errors?.['min']">Rent must be positive</div>
            </div>
          </div>
          <!-- Description -->
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" formControlName="description" class="form-control" rows="4" placeholder="Enter a detailed description within 1400 characters"></textarea>
            <div class="error" *ngIf="submitted && listingForm.get('description')?.errors">
              <div *ngIf="listingForm.get('description')?.errors?.['required']">Description is required</div>
              <div *ngIf="listingForm.get('description')?.errors?.['maxlength']">Description cannot exceed 1400 characters</div>
            </div>
          </div>
          <!-- Amenities -->
          <div class="form-group">
            <label>Amenities included</label>
            <div class="amenities-grid">
              <label><input type="checkbox" formControlName="gym"> Gym/Fitness Center</label>
              <label><input type="checkbox" formControlName="pool"> Swimming Pool</label>
              <label><input type="checkbox" formControlName="carPark"> Car Park</label>
              <label><input type="checkbox" formControlName="visitorsParking"> Visitors Parking</label>
              <label><input type="checkbox" formControlName="powerBackup"> Power Backup</label>
              <label><input type="checkbox" formControlName="garbageDisposal"> Garbage Disposal</label>
              <label><input type="checkbox" formControlName="privateLawn"> Private Lawn</label>
              <label><input type="checkbox" formControlName="waterHeater"> Water Heater</label>
              <label><input type="checkbox" formControlName="plantSecurity"> Plant Security System</label>
              <label><input type="checkbox" formControlName="laundry"> Laundry Service</label>
              <label><input type="checkbox" formControlName="elevator"> Elevator</label>
              <label><input type="checkbox" formControlName="clubHouse"> Club House</label>
            </div>
          </div>
          <!-- Photo Upload -->
          <div class="form-group">
            <label for="photos">Upload Photos</label>
            <input id="photos" type="file" (change)="onFileChange($event)" multiple accept="image/*" class="form-control" />
            <div class="photo-preview-grid" *ngIf="photoPreviews.length">
              <div class="photo-preview" *ngFor="let photo of photoPreviews">
                <img [src]="photo" alt="Preview" />
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-btn">Preview</button>
            <button type="button" class="submit-btn" style="background:#888;margin-left:10px;" (click)="onCancel()">Cancel</button>
          </div>
        </form>

        <!-- Preview Mode -->
        <div *ngIf="previewMode" class="preview-section">
          <div class="preview-header">Preview and Submit</div>
          <div class="preview-grid">
            <div class="preview-row">
              <div class="preview-box"><b>Title</b><br>{{ listingForm.value.propertyTitle }}</div>
              <div class="preview-box"><b>Property Type</b><br>{{ listingForm.value.apartmentType | titlecase }}</div>
              <div class="preview-box"><b>Number of Beds</b><br>{{ listingForm.value.numberOfBeds }}</div>
            </div>
            <div class="preview-row">
              <div class="preview-box" style="flex:2"><b>Address</b><br>{{ listingForm.value.streetAddress }}</div>
              <div class="preview-box"><b>Rent</b><br>₹{{ listingForm.value.expectedRent }}/month</div>
            </div>
            <div class="preview-row">
              <div class="preview-box" style="flex:2"><b>Description</b><br>{{ listingForm.value.description }}</div>
              <div class="preview-box"><b>Amenities</b><br>
                <div *ngFor="let amenity of getSelectedAmenities()">{{ amenity }}</div>
              </div>
            </div>
            <div class="preview-row">
              <div class="preview-box" style="flex:1 1 100%">
                <b>Photos</b>
                <div class="photo-preview-grid">
                  <div class="photo-preview" *ngFor="let photo of photoPreviews">
                    <img [src]="photo" alt="Preview" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-actions" style="justify-content: space-between;">
            <button type="button" class="submit-btn" style="background:#888;" (click)="previewMode = false">Back</button>
            <button type="button" class="submit-btn" (click)="submitListing()">Submit</button>
          </div>
        </div>
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
      max-width: 700px;
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
    }
    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }
    .error {
      color: #e74c3c;
      font-size: 14px;
      margin-top: 4px;
    }
    .radio-group {
      display: flex;
      gap: 20px;
      margin-bottom: 8px;
    }
    .radio-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 8px 16px;
      margin-top: 8px;
    }
    .form-actions {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
    }
    .submit-btn {
      padding: 12px 24px;
      background: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .submit-btn:hover {
      background: #27ae60;
    }
    .photo-preview-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
    .photo-preview img { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; border: 1px solid #ccc; }
    .preview-section { margin-top: 20px; }
    .preview-header { font-size: 1.5rem; font-weight: bold; text-align: center; margin-bottom: 24px; }
    .preview-grid { display: flex; flex-direction: column; gap: 16px; }
    .preview-row { display: flex; gap: 16px; }
    .preview-box { background: #f8f8f8; border: 1px solid #ccc; border-radius: 6px; padding: 16px; flex: 1; min-width: 180px; }
  `]
})
export class CreateListingComponent implements OnInit {
  listingForm: FormGroup;
  submitted = false;
  photoPreviews: string[] = [];
  photos: { name: string, data: string }[] = [];
  previewMode = false;

  constructor(
    private fb: FormBuilder,
    private listingService: ListingService,
    private router: Router
  ) {
    this.listingForm = this.fb.group({
      apartmentType: ['', Validators.required],
      propertyTitle: ['', Validators.required],
      numberOfBeds: ['', [Validators.required, Validators.min(1)]],
      streetAddress: ['', Validators.required],
      expectedRent: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.maxLength(1400)]],
      gym: [false],
      pool: [false],
      carPark: [false],
      visitorsParking: [false],
      powerBackup: [false],
      garbageDisposal: [false],
      privateLawn: [false],
      waterHeater: [false],
      plantSecurity: [false],
      laundry: [false],
      elevator: [false],
      clubHouse: [false]
    });
  }

  ngOnInit(): void {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.photoPreviews = [];
      this.photos = [];
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photoPreviews.push(e.target.result);
          this.photos.push({ name: file.name, data: e.target.result });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onPreview(): void {
    this.submitted = true;
    if (this.listingForm.valid) {
      this.previewMode = true;
    }
  }

  submitListing(): void {
    console.log('submitListing called');
    console.log('Form valid:', this.listingForm.valid);
    console.log('Form errors:', this.listingForm.errors);
    console.log('Form value:', this.listingForm.value);
    // Only called from preview mode
    if (this.listingForm.valid) {
      // Gather amenities
      const amenities: string[] = [];
      const amenityFields = [
        'gym', 'pool', 'carPark', 'visitorsParking', 'powerBackup', 'garbageDisposal',
        'privateLawn', 'waterHeater', 'plantSecurity', 'laundry', 'elevator', 'clubHouse'
      ];
      amenityFields.forEach(field => {
        if (this.listingForm.get(field)?.value) amenities.push(field);
      });
      let imageUrl: string | undefined = undefined;
      if (this.photos.length > 0) {
        const frontPhoto = this.photos.find(photo => photo.name.toLowerCase().includes('front'));
        imageUrl = frontPhoto ? frontPhoto.data : this.photos[0].data;
      }
      const listingData = {
        title: this.listingForm.value.propertyTitle,
        apartmentType: this.listingForm.value.apartmentType,
        numberOfBeds: this.listingForm.value.numberOfBeds,
        address: this.listingForm.value.streetAddress,
        price: this.listingForm.value.expectedRent,
        description: this.listingForm.value.description,
        amenities,
        photos: this.photos.map(p => p.data),
        imageUrl
      };
      console.log('About to call createListing', listingData);
      this.listingService.createListing(listingData).subscribe({
        next: () => {
          console.log('Listing created, navigating home');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error creating listing:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  getSelectedAmenities(): string[] {
    const amenityFields = [
      { key: 'gym', label: 'Gym/Fitness Center' },
      { key: 'pool', label: 'Swimming Pool' },
      { key: 'carPark', label: 'Car Park' },
      { key: 'visitorsParking', label: 'Visitors Parking' },
      { key: 'powerBackup', label: 'Power Backup' },
      { key: 'garbageDisposal', label: 'Garbage Disposal' },
      { key: 'privateLawn', label: 'Private Lawn' },
      { key: 'waterHeater', label: 'Water Heater' },
      { key: 'plantSecurity', label: 'Plant Security System' },
      { key: 'laundry', label: 'Laundry Service' },
      { key: 'elevator', label: 'Elevator' },
      { key: 'clubHouse', label: 'Club House' }
    ];
    return amenityFields.filter(f => this.listingForm.get(f.key)?.value).map(f => f.label);
  }
} 