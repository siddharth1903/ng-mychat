import { Injectable } from '@angular/core';

import { AngularFireList, AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AuthService } from '../auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public messages: Observable<any>;
  public users: Observable<any>;
  public displayName: string;
  public email: string;
  public chatEnable: string;
  subscriber: any;
  constructor(public af: AngularFireDatabase, private auth: OAuthService, private afAuth: AngularFireAuth) {
    this.messages = this.af.list('messages').valueChanges();
    this.users = this.af.list('users').valueChanges();
  }

  login(): void {
    this.afAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  updateUserStatus(status): Observable<any> {

    this.users.subscribe(snapshots => {

      snapshots.forEach(snapshot => {

        if (snapshot.email === this.email) {
          this.af.list('users').update(snapshot.$key, {
            status
          });
        }

      }, this);

    });
    return this.users;
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
      message: text,
      to: email,
      timestamp: Date.now()
    };
    this.af.list('messages').push(message);
  }
}
