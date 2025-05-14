import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

// Constants
const STORAGE_KEY = 'currentUser';
const API_URL = 'api';

// Types
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
}

interface AuthResponse {
  body: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.initializeUserFromStorage();
  }

  private initializeUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      this.clearUserData();
    }
  }

  login(email: string, password: string): Observable<User> {
    const loginData: LoginRequest = { email, password };
    return this.http.post<User>(`${API_URL}/auth/login`, loginData)
      .pipe(
        map(this.validateUserResponse),
        tap(this.storeUserData),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, userData)
      .pipe(
        map(response => response.body),
        tap(this.storeUserData),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.clearUserData();
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private validateUserResponse = (response: User): User => {
    if (!response?.id) {
      throw new Error('Invalid login credentials');
    }
    return response;
  };

  private storeUserData = (user: User): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Error storing user data:', error);
      this.clearUserData();
    }
  };

  private clearUserData = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUserSubject.next(null);
  };

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid email or password';
          break;
        case 500:
          errorMessage = 'Server error occurred';
          break;
        default:
          errorMessage = error.error?.error || error.message;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  };
} 