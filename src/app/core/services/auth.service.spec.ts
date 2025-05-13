import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    fullName: 'Test User',
    password: 'test123',
    phone: '123-456-7890',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    favorites: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', () => {
      service.login('test@example.com', 'test123').subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(localStorage.getItem('currentUser')).toBeTruthy();
      });

      const req = httpMock.expectOne('api/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush(mockUser);
    });

    it('should handle invalid credentials', () => {
      service.login('test@example.com', 'wrongpassword').subscribe({
        error: (error) => {
          expect(error.message).toBe('Invalid email or password');
        }
      });

      const req = httpMock.expectOne('api/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush({ error: 'Invalid email or password' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle invalid login response', () => {
      service.login('test@example.com', 'test123').subscribe({
        error: (error) => {
          expect(error.message).toBe('Invalid login credentials');
        }
      });

      const req = httpMock.expectOne('api/auth/login');
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('register', () => {
    const newUser = {
      fullName: 'New User',
      email: 'new@example.com',
      password: 'password123',
      phone: '987-654-3210',
      role: 'user'
    };

    it('should register successfully', () => {
      service.register(newUser).subscribe(user => {
        expect(user).toBeTruthy();
        expect(localStorage.getItem('currentUser')).toBeTruthy();
      });

      const req = httpMock.expectOne('api/auth/register');
      expect(req.request.method).toBe('POST');
      req.flush({ body: { ...newUser, id: '2' } });
    });

    it('should handle registration error', () => {
      service.register(newUser).subscribe({
        error: (error) => {
          expect(error.message).toBe('Registration failed');
        }
      });

      const req = httpMock.expectOne('api/auth/register');
      expect(req.request.method).toBe('POST');
      req.flush({ error: 'Registration failed' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('logout', () => {
    it('should clear user data on logout', () => {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      service.logout();
      expect(localStorage.getItem('currentUser')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is logged in', () => {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false when user is not logged in', () => {
      localStorage.clear();
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when logged in', () => {
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      expect(service.getCurrentUser()).toEqual(mockUser);
    });

    it('should return null when not logged in', () => {
      localStorage.clear();
      expect(service.getCurrentUser()).toBeNull();
    });
  });
}); 