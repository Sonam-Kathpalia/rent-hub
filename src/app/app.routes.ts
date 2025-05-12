import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CreateListingComponent } from './features/listings/create-listing/create-listing.component';
import { ListingDetailsComponent } from './features/listings/listing-details/listing-details.component';
import { authGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './features/profile/profile.component';
import { CommentsComponent } from './features/comments/comments.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'listings/create', 
    component: CreateListingComponent,
    canActivate: [authGuard]
  },
  {
    path: 'listings/:id',
    component: ListingDetailsComponent
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'listings/:id/comments', component: CommentsComponent },
  { path: '**', redirectTo: '' }
];
