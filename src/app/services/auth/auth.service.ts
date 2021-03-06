import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';

import { ChatUsersService } from '@services/chat-users/chat-users.service';
import { ChatService } from '@services/chat/chat.service';

export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://gchat.au.auth0.com/',

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.href,

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: 'Sar8qeC0eCqT2DZ3maD8E3N4pdGB8uL1',

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  // dummyClientSecret: 'secret',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope: 'openid profile email offline_access',

  showDebugInformation: true,
  customQueryParams: {
    // Your API's name
    audience: 'https://gchat.au.auth0.com/api/v2/',
  },
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInUser: object;

  constructor(
    private oauthService: OAuthService,
    private chatUsersService: ChatUsersService,
    private chatService: ChatService
  ) {
    this.oauthService.configure(authCodeFlowConfig);

    this.oauthService.setStorage(localStorage);

    this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then((value: boolean) => {
        if (this.isAuthenticated()) {
          this.userProfile = this.oauthService.getIdentityClaims();

          this.chatService.userId = this.userProfile.sub;

          this.chatUsersService.authenticate();

          this.chatService.checkIfUserExists().subscribe((isUserExists: boolean) => {

            if (isUserExists) {

              this.chatService.updateUserStatus('online');

            } else {

              this.chatService.addUserInfo({
                email: this.userProfile.email,
                displayName: this.userProfile.name,
                ... this.userProfile.picture ? { picture: this.userProfile.picture } : {}
              });

            }
          });

        }
      });
    this.oauthService.setupAutomaticSilentRefresh();
  }

  set userProfile(userProfile: any) {
    this.loggedInUser = userProfile;
  }

  get userProfile(): any {
    return this.loggedInUser;
  }

  /**
   *
   * Logs the current user out.
   *
   */
  public logout(): void {
    this.oauthService.revokeTokenAndLogout(
      {
        client_id: this.oauthService.clientId,
        returnTo: this.oauthService.redirectUri,
      },
      true
    );

    this.chatService.updateUserStatus('offline');
  }

  /**
   *
   * Logs a user in.
   *
   */
  public login(): void {
    this.oauthService.initCodeFlow();
  }

  /**
   *
   * Returns if the cuurent user is authenticated.
   *
   */
  public isAuthenticated(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
