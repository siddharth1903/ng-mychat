import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { MANAGE_AUTH_CONFIG } from './auth.config';

@Injectable({
  providedIn: 'root'
})
export class ChatUsersService {

  allUsers: any;
  httpWithoutInterceptor: HttpClient;
  authToken: string | undefined;

  constructor(private httpClient: HttpClient, private backend: HttpBackend, private oauthService: OAuthService) {

    this.httpWithoutInterceptor = new HttpClient(backend);
  }

  authenticate(): void {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.httpClient.post(MANAGE_AUTH_CONFIG.oauthUrl, {
      client_id: MANAGE_AUTH_CONFIG.clientID,
      audience: MANAGE_AUTH_CONFIG.audience,
      grant_type: MANAGE_AUTH_CONFIG.grantType,
      client_secret: MANAGE_AUTH_CONFIG.clientSecret
    }, {
      headers
    }).subscribe((token: any) => {
      localStorage.setItem('id_token', token.access_token);
      this.authToken = token.access_token;
    });
  }

  getAllUsers(): void {

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken}`
    });

    this.httpWithoutInterceptor.get(this.oauthService.issuer + 'api/v2/users', {
      headers
    }).subscribe(
      data => this.allUsers = data,
      error => this.allUsers = error._body || error
    );
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
