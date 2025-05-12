import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Listing } from '../models/listing.model';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private apiUrl = 'api';

  constructor(private http: HttpClient) {}

  getListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.apiUrl}/listings`);
  }

  getListingById(id: string): Observable<Listing> {
    return this.http.get<Listing>(`${this.apiUrl}/listings/${id}`);
  }

  createListing(listing: Partial<Listing>): Observable<Listing> {
    return this.http.post<Listing>(`${this.apiUrl}/listings`, listing);
  }

  updateListing(id: string, listing: Partial<Listing>): Observable<Listing> {
    return this.http.put<Listing>(`${this.apiUrl}/listings/${id}`, listing);
  }

  deleteListing(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/listings/${id}`);
  }

  searchListings(query: string): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.apiUrl}/listings?q=${query}`);
  }

  toggleFavorite(id: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/listings/${id}/favorite`, { userId });
  }

  addComment(listingId: string, comment: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/listings/${listingId}/comments`, { content: comment });
  }

  addCommentToListing(listingId: string, comment: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/listings/${listingId}/comments`, comment);
  }
} 