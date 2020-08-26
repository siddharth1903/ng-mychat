import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AngularFireAuthModule } from '@angular/fire/auth';

import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChatUsersComponent } from './chat-users/chat-users.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    ChatUsersComponent,
    ChatRoomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
        sendAccessToken: true,
        allowedUrls: ['https://gchat.au.auth0.com']
      }
    }),
    FontAwesomeModule,
    NgbModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
