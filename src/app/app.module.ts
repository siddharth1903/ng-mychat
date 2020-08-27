import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { OAuthModule } from 'angular-oauth2-oidc';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';

import { FormsModule } from '@angular/forms';

import { ChatRoomComponent } from '@components/chat-room/chat-room.component';
import { ChatUsersComponent } from '@components/chat-users/chat-users.component';
import { UserProfileComponent } from '@components/user-profile/user-profile.component';

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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
        sendAccessToken: true,
        allowedUrls: ['https://gchat.au.auth0.com']
      }
    }),
    FontAwesomeModule,
    NgbCollapseModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
