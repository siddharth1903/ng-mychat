import { Injectable } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public messages: Observable<any>;
  public users: Observable<any>;

  private emailId: string;
  private chatDisplayName: string;

  constructor(public af: AngularFireDatabase) {
    this.messages = this.af.list('messages').valueChanges();
    this.users = this.af.list('users').valueChanges();
  }

  get displayName(): string {
    return this.chatDisplayName;
  }

  set displayName(displayName) {
    this.chatDisplayName = displayName;
  }

  get email(): string {
    return this.emailId;
  }

  set email(emailId) {
    this.emailId = emailId;
  }

  /**
   *
   * Updates current User Status visibility
   *
   * @param status Online/offline
   *
   */
  updateUserStatus(status: 'online' | 'offline'): void {
    this.af
      .list('users')
      .snapshotChanges()
      .pipe(first())
      .subscribe((snapshots) => {
        snapshots.forEach((snapshot) => {
          const snapshotEmail: string = snapshot.payload.child('email').val();

          if (snapshotEmail === this.email) {
            this.af.list('users').update(snapshot.key, {
              status,
            });
          }
        }, this);
      });
  }

  /**
   *
   * Checks if user exists in the database
   *
   * @param email The email id.
   *
   */
  private checkIfUserExists(
    email: string
  ): Observable<SnapshotAction<unknown>[]> {
    return this.af
      .list('users', (ref) => ref.orderByChild('email').equalTo(email))
      .snapshotChanges();
  }

  /**
   *
   * Adds user information into the database.
   *
   */
  addUserInfo(): void {
    this.checkIfUserExists(this.email)
      .pipe(first())
      .subscribe((results) => {
        if (results.length === 0) {
          this.af.list('users').push({
            email: this.email,
            displayName: this.displayName,
            status: 'online',
          });
        } else {
          this.updateUserStatus('online');
        }
      });
  }

  /**
   *
   * Adds a message to the Firebase Realtime Database
   *
   * @param text the  text message.
   * @param email the email address.
   *
   */
  sendMessage(text, email): void {
    const message = {
      email: this.email,
      displayName: this.displayName,
      message: text,
      to: email,
      timestamp: Date.now(),
    };
    this.af.list('messages').push(message);
  }
}
