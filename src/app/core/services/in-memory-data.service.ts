import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Listing } from '../models/listing.model';
import { User } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

export class InMemoryDataService implements InMemoryDbService {
  private users: User[] = [
    {
      id: '1',
      email: 'test@example.com',
      fullName: 'Test User',
      password: 'test123',
      phone: '123-456-7890',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      favorites: []
    },
    {
      id: '2',
      email: 'landlord@example.com',
      fullName: 'Landlord User',
      password: 'landlord123',
      phone: '987-654-3210',
      role: 'landlord',
      createdAt: new Date(),
      updatedAt: new Date(),
      favorites: []
    }
  ];

  createDb() {
    let listings: Listing[];
    const local = localStorage.getItem('dev-listings');
    if (local) {
      listings = JSON.parse(local).map((l: any) => ({
        ...l,
        createdAt: new Date(l.createdAt),
        updatedAt: new Date(l.updatedAt)
      }));
    } else {
      listings = [
        {
          id: '1',
          title: 'Luxury Penthouse with View',
          address: '123 Skyline Ave, Uptown, Metropolis, NY',
          description: 'Stunning views of the city from this luxury penthouse',
          price: 100000,
          location: 'Uptown',
          imageUrl: 'assets/images/listing-1-front.jpg',
          photos: [
            'assets/images/listing-1-front.jpg',
            'assets/images/listing-1-kitchen.jpg',
            'assets/images/listing-1-bathroom.jpg',
            'assets/images/listing-1-living.jpg'
          ],
          amenities: ['Parking', 'Gym', 'Pool'],
          ownerId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          comments: [],
          apartmentType: 'Penthouse'
        },
        {
          id: '2',
          title: 'Modern Downtown Apartment',
          address: '456 Central Blvd, Downtown, Metropolis, NY',
          description: 'Beautiful modern apartment in the heart of downtown',
          price: 85000,
          location: 'Downtown',
          imageUrl: 'assets/images/listing-2-front.jpg',
          photos: [
            'assets/images/listing-2-front.jpg',
            'assets/images/listing-2-kitchen.jpg',
            'assets/images/listing-2-bathroom.jpg',
            'assets/images/listing-2-living.jpg'
          ],
          amenities: ['Doorman', 'Rooftop Pool', 'Concierge'],
          ownerId: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
          comments: [],
          apartmentType: 'Apartment'
        },
        {
          id: '3',
          title: 'Cozy Studio Near University',
          address: '789 College Rd, University District, Metropolis, NY',
          description: 'Perfect for students, close to campus',
          price: 60000,
          location: 'University District',
          imageUrl: 'assets/images/listing-3-front.jpg',
          photos: [
            'assets/images/listing-3-front.jpg',
            'assets/images/listing-3-kitchen.jpg',
            'assets/images/listing-3-bathroom.jpg',
            'assets/images/listing-3-living.jpg'
          ],
          amenities: ['WiFi', 'Laundry', 'Study Room'],
          ownerId: '3',
          createdAt: new Date(),
          updatedAt: new Date(),
          comments: [],
          apartmentType: 'Studio'
        }
      ];
      localStorage.setItem('dev-listings', JSON.stringify(listings));
    }
    return { listings, users: this.users, auth: [] };
  }

  // Override the genId method to ensure that users always have an id.
  genId(users: User[]): string {
    return users.length > 0 ? Math.max(...users.map(user => +user.id)) + 1 + '' : '1';
  }

  // Override the post method to handle authentication endpoints
  post(reqInfo: RequestInfo): Observable<any> | undefined {
    const collectionName = reqInfo.collectionName;
    const body = reqInfo.utils.getJsonBody(reqInfo.req);

    if (collectionName === 'auth') {
      if (reqInfo.url.endsWith('/register')) {
        // Handle registration
        const newUser: User = {
          id: this.genId(this.users),
          email: body.email,
          fullName: body.fullName,
          password: body.password,
          phone: body.phone,
          role: body.role,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.users.push(newUser);
        return of(new HttpResponse({
          status: 201,
          body: newUser
        }));
      } else if (reqInfo.url.endsWith('/login')) {
        // Handle login
        const user = this.users.find(u => u.email === body.email && u.password === body.password);
        if (user) {
          return of(new HttpResponse({
            status: 200,
            body: { ...user }
          }));
        }
        return of(new HttpResponse({
          status: 401,
          body: { error: 'Invalid credentials' }
        }));
      }
    }

    // Handle favorite toggle
    if (collectionName === 'listings' && /\/listings\/.+\/favorite$/.test(reqInfo.url)) {
      const match = reqInfo.url.match(/\/listings\/(.+)\/favorite$/);
      const listingId = match ? match[1] : null;
      // Get userId from request header or body (simulate auth)
      const userId = body && body.userId;
      if (listingId && userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          if (!user.favorites) user.favorites = [];
          const idx = user.favorites.indexOf(listingId);
          if (idx > -1) {
            user.favorites.splice(idx, 1);
          } else {
            user.favorites.push(listingId);
          }
          return of(new HttpResponse({ status: 200, body: { success: true, favorites: user.favorites } }));
        }
      }
      return of(new HttpResponse({ status: 404, body: { error: 'User or listing not found' } }));
    }

    // Handle adding a comment to a listing
    if (collectionName === 'listings' && /\/listings\/.+\/comments$/.test(reqInfo.url)) {
      const match = reqInfo.url.match(/\/listings\/(.+)\/comments$/);
      const listingId = match ? match[1] : null;
      if (listingId) {
        const listings = reqInfo.collection as Listing[];
        const listing = listings.find(l => l.id === listingId);
        if (listing) {
          if (!listing.comments) listing.comments = [];
          listing.comments.push(body);
          return of(new HttpResponse({ status: 200, body: listing }));
        }
      }
      return of(new HttpResponse({ status: 404, body: { error: 'Listing not found' } }));
    }

    // For all other POST requests, use the default handler
    return undefined;
  }

  // After any POST/PUT/DELETE to listings, update localStorage
  // Patch: persist listings to localStorage on POST/PUT/DELETE
  // This is a dev hack for HMR persistence
  responseInterceptor(response: any, requestInfo: RequestInfo) {
    if (requestInfo.collectionName === 'listings' && ['POST', 'PUT', 'DELETE'].includes((requestInfo.req as any).method)) {
      const db: any = requestInfo.utils.getDb();
      const listings = db && db['listings'] ? db['listings'] : [];
      const safeListings = listings.map((l: any) => ({ ...l, photos: [] }));
      localStorage.setItem('dev-listings', JSON.stringify(safeListings));
    }
    return response;
  }
} 