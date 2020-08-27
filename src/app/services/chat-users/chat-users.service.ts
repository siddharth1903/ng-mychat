import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';

import { MANAGE_AUTH } from '@constants/auth/manage-auth';

@Injectable({
  providedIn: 'root',
})
export class ChatUsersService {
  public allUsers: any;
  public authToken: string | undefined;

  private httpWithoutInterceptor: HttpClient;

  constructor(
    private httpClient: HttpClient,
    private backend: HttpBackend,
    private oauthService: OAuthService
  ) {
    this.httpWithoutInterceptor = new HttpClient(this.backend);

    this.oauthService.events.subscribe((event: OAuthEvent) => {
      if (event.type === 'logout') {
        this.authToken = undefined;
        localStorage.removeItem('id_token');
      }
    });
  }

  /**
   *
   * Authenticates the logged in user for auth0 management API's.
   *
   */
  authenticate(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.httpClient
      .post(
        MANAGE_AUTH.oauthUrl,
        {
          client_id: MANAGE_AUTH.clientID,
          audience: MANAGE_AUTH.audience,
          grant_type: MANAGE_AUTH.grantType,
          client_secret: MANAGE_AUTH.clientSecret,
        },
        {
          headers,
        }
      )
      .subscribe((token: any) => {
        localStorage.setItem('id_token', token.access_token);
        this.authToken = token.access_token;
      });
  }

  /**
   *
   * Fetches the list of all users available in the idp.
   *
   */
  fetchAllUsers(): void {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`,
    });

    this.httpWithoutInterceptor
      .get(this.oauthService.issuer + 'api/v2/users', {
        headers,
      })
      .subscribe(
        (data) => (this.allUsers = data),
        (error) => (this.allUsers = error._body || error)
      );
  }
}
