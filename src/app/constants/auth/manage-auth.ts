import { AuthConfig } from '@models/auth/auth-config';

export const MANAGE_AUTH: AuthConfig = {
  clientID: 'vPaSA7LL0a932iSo5DMQn3B4kNJQKr1J',
  clientSecret:
    'TUZyy3x0W80OlanWRdRMJWAJo4DmG1YB7RYoaDxynZx3GLDbcgqRzK_83cDdatKP',
  fetchUsersUrl: 'https://gchat.au.auth0.com/api/v2/users',
  oauthUrl: 'https://gchat.au.auth0.com/oauth/token',
  grantType: 'client_credentials',
  audience: 'https://gchat.au.auth0.com/api/v2/',
};
