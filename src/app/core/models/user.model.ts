export interface User {
  id: string;
  email: string;
  fullName: string;
  password?: string;
  phone?: string;
  role: 'user' | 'landlord';
  createdAt: Date;
  updatedAt: Date;
  favorites?: string[];
} 