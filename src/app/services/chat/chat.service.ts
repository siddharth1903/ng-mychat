import { Injectable } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscriber } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public messages: Observable<any>;
  public users: Observable<any>;


  private userIdentifier: string;

  constructor(public af: AngularFireDatabase, private afStore: AngularFirestore) {
    this.messages = this.af.list('messages').valueChanges();
    this.users = this.af.list('users').valueChanges();
  }

  get userId(): string {
    return this.userIdentifier;
  }

  set userId(userId) {
    this.userIdentifier = userId;
  }


  /**
   *
   * Updates current User Status visibility
   *
   * @param status online/offline
   *
   */
  updateUserStatus(status: 'online' | 'offline'): void {

    const userQuery = this.af.database.ref('users').orderByChild('id').equalTo(this.userId);

    userQuery.once('child_added', (snapshot) => {
      snapshot.ref.update({
        status
      });
    });

  }

  /**
   *
   * Checks if user exists in the database
   *
   *
   */
  public checkIfUserExists(): Observable<boolean> {

    return new Observable<boolean>((observer: Subscriber<boolean>) => {

      this.af
        .list('users', (ref) => ref.orderByChild('id').equalTo(this.userId))
        .query.once('value', (snapshot) => {

          observer.next(snapshot.exists());
          observer.complete();
        });

    });

  }

  /**
   *
   * Adds users into the database.
   *
   * @param profileObject The user profile to be inserted.
   *
   */
  addUserInfo(profileObject: {
    email: string;
    displayName: string;
    picture?: string;
  }): void {

    this.af.list('users').push({
      email: profileObject.email,
      displayName: profileObject.displayName,
      status: 'online',
      id: this.userId,
      picture: profileObject.picture || ''
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
  sendMessage(text, userId): void {
    const message = {
      fromId: this.userId,
      message: text,
      toId: userId,
      timestamp: Date.now(),
    };
    this.af.list('messages').push(message);
  }
}
