import { Injectable } from '@angular/core';

import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';


import { OAuthService } from 'angular-oauth2-oidc';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public messages: Observable<any>;
  public users: Observable<any>;
  private emailId: string;
  private chatDisplayName: string;

  public chatEnable: string;
  subscriber: any;
  constructor(public af: AngularFireDatabase, private auth: OAuthService, private store: AngularFirestore) {


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

  updateUserStatus(status): void {

    this.af.list('users').snapshotChanges().pipe(first()).subscribe(snapshots => {

      snapshots.forEach(snapshot => {

        const snapshotEmail: string = snapshot.payload.child('email').val();

        if (snapshotEmail === this.email) {

          this.af.list('users').update(snapshot.key, {
            status
          });
        }

      }, this);

    });
  }

  checkIfUserExists(email): Observable<SnapshotAction<unknown>[]> {

    return this.af.list('users', (ref) => ref.orderByChild('email').equalTo(email)).snapshotChanges();

  }


  /**
   *
   */
  addUserInfo(): void {

    this.subscriber = this.checkIfUserExists(this.email).subscribe(results => {
      if (results.length === 0) {
        this.af.list('users').push({
          email: this.email,
          displayName: this.displayName,
          status: 'online'
        });
      }
      else {
        this.updateUserStatus('online');
      }
      // un subscribing after login as this is desired
      this.subscriber.unsubscribe();
    });

    // We saved their auth info now save the rest to the db.

    console.log('users', this.users);

  }

  /**
   *
   * Saves a message to the Firebase Realtime Database
   * @param text the  text message
   * @param email the email address
   *
   */
  sendMessage(text, email): void {

    const message = {
      email: this.email,
      displayName: this.displayName,
      message: text,
      to: email,
      timestamp: Date.now()
    };
    this.af.list('messages').push(message);
  }
}
