import { Component } from '@angular/core';

import {
  faExclamationTriangle,
  faSignInAlt,
} from '@fortawesome/free-solid-svg-icons';

import { AuthService } from './services/auth/auth.service';
import { ChatUsersService } from './services/chat-users/chat-users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-mychat';
  public isMenuCollapsed = true;

  public signInIcon = faSignInAlt;
  public maskTriangleIcon = faExclamationTriangle;

  constructor(
    public auth: AuthService,
    public chatUsersService: ChatUsersService
  ) { }
}
