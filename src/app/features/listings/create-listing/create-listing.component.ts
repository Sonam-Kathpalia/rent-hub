import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ListingService } from '../../../core/services/listing.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class CreateListingComponent implements OnInit {
  createListingForm: FormGroup;
  submitted = false;
  previewMode = false;
  selectedPhotos: File[] = [];
  photoUrls: { url: string; name: string }[] = [];

  propertyTypes = [
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Penthouse', label: 'Penthouse' },
    { value: 'Studio', label: 'Studio' }
  ];

  amenities = [
    { value: 'parking', label: 'Parking' },
    { value: 'gym', label: 'Gym' },
    { value: 'pool', label: 'Pool' },
    { value: 'doorman', label: 'Doorman' },
    { value: 'rooftop-pool', label: 'Rooftop Pool' },
    { value: 'concierge', label: 'Concierge' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'laundry', label: 'Laundry' },
    { value: 'study-room', label: 'Study Room' }
  ];

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private listingService: ListingService,
    private authService: AuthService,
    public router: Router
  ) {
    this.createListingForm = this.formBuilder.group({
      apartmentType: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(10)]],
      beds: [1, [Validators.required, Validators.min(1)]],
      address: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1), Validators.pattern('^[1-9][0-9]*$')]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      amenities: this.formBuilder.array<FormControl<boolean>>([]),
      photos: [[]]
    });
  }

  ngOnInit(): void {
    // Initialize amenities form array with FormArray
    const amenitiesArray = this.createListingForm.get('amenities') as FormArray<FormControl<boolean>>;
    this.amenities.forEach(() => {
      amenitiesArray.push(this.formBuilder.control<boolean>(false));
    });
  }

  // Add getter for amenities form array with proper typing
  get amenitiesArray(): FormArray<FormControl<boolean>> {
    return this.createListingForm.get('amenities') as FormArray<FormControl<boolean>>;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedPhotos = Array.from(input.files);
      this.photoUrls = [];
      this.selectedPhotos.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photoUrls.push({
            url: e.target.result,
            name: file.name.toLowerCase()
          });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  togglePreview(): void {
    this.submitted = true;
    if (this.createListingForm.valid) {
      this.previewMode = !this.previewMode;
    }
  }

  getSelectedAmenities(): string[] {
    const formAmenities = this.createListingForm.get('amenities')?.value as boolean[];
    return this.amenities
      .filter((_, index) => formAmenities[index])
      .map(amenity => amenity.label);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.createListingForm.invalid) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return;
    }

    const formData = this.createListingForm.value;
    const selectedAmenities = this.amenities
      .filter((_, index) => formData.amenities[index])
      .map(amenity => amenity.value);

    const sortedPhotos = [...this.photoUrls].sort((a, b) => {
      const aIsFront = a.name.includes('front');
      const bIsFront = b.name.includes('front');
      if (aIsFront && !bIsFront) return -1;
      if (!aIsFront && bIsFront) return 1;
      return 0;
    });

    const listing = {
      ...formData,
      amenities: selectedAmenities,
      photos: sortedPhotos.map(photo => photo.url),
      landlordId: currentUser.id,
      landlordName: currentUser.fullName,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    this.listingService.createListing(listing).subscribe({
      next: () => {
        this.router.navigate(['/listings']);
      },
      error: (error) => {
        console.error('Error creating listing:', error);
      }
    });
  }
} 