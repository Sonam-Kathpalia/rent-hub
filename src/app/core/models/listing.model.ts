export interface Listing {
  id: string;
  title: string;
  address: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  favorite?: boolean;
  photos: string[];
  comments?: any[];
  apartmentType: string;
} 