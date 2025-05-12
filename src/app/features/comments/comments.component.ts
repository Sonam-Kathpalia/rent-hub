import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListingService } from '../../core/services/listing.service';
import { AuthService } from '../../core/services/auth.service';
import { Listing } from '../../core/models/listing.model';

interface Comment {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userRole: string;
  text: string;
  createdAt: Date;
}

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="comments-wrapper">
      <h2>Comments</h2>
      <div *ngIf="comments.length === 0">No comments yet.</div>
      <div *ngFor="let comment of comments" class="comment-box">
        <div class="comment-header"><b>{{ comment.userName }} ({{ comment.userRole }})</b></div>
        <div class="comment-body">{{ comment.text }}</div>
        <div class="comment-date">{{ comment.createdAt | date:'short' }}</div>
      </div>
      <div *ngIf="isLoggedIn" class="add-comment-section">
        <label for="commentText">Leave a Comment</label>
        <textarea id="commentText" [(ngModel)]="newCommentText" rows="3" class="comment-input"></textarea>
        <button (click)="addComment()" class="submit-btn" [disabled]="!isLoggedIn">Submit</button>
      </div>
      <div *ngIf="!isLoggedIn" class="login-warning">
        Please login to post a comment.
      </div>
    </div>
  `,
  styles: [`
    .comments-wrapper { max-width: 700px; margin: 32px auto; padding: 24px; border: 1px solid #bbb; border-radius: 6px; background: #fff; }
    .comment-box { border: 1px solid #444; border-radius: 3px; padding: 10px 14px 8px 14px; background: #fafafa; margin-bottom: 16px; }
    .comment-header { font-weight: bold; margin-bottom: 4px; }
    .comment-body { margin-bottom: 4px; }
    .comment-date { font-size: 0.85em; color: #888; }
    .add-comment-section { margin-top: 24px; }
    .comment-input { width: 100%; margin-bottom: 8px; }
    .submit-btn { background: #2ecc71; color: white; border: none; border-radius: 4px; padding: 8px 18px; cursor: pointer; }
    .login-warning { color: #e74c3c; margin-top: 16px; }
  `]
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  listingId: string = '';
  newCommentText: string = '';
  isLoggedIn = false;
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.currentUser = this.authService.getCurrentUser();
    this.route.paramMap.subscribe(params => {
      this.listingId = params.get('id') || '';
      this.loadComments();
    });
  }

  loadComments() {
    this.listingService.getListingById(this.listingId).subscribe(listing => {
      this.comments = (listing as any).comments || [];
    });
  }

  addComment() {
    if (!this.isLoggedIn) {
      window.alert('Please login if you want to comment.');
      return;
    }
    if (!this.newCommentText.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      listingId: this.listingId,
      userId: this.currentUser.id,
      userName: this.currentUser.fullName,
      userRole: this.currentUser.role,
      text: this.newCommentText,
      createdAt: new Date()
    };
    this.listingService.addCommentToListing(this.listingId, newComment).subscribe(() => {
      this.newCommentText = '';
      this.loadComments();
    });
  }
} 