import { Component, Input, OnInit } from '@angular/core';

import { faDotCircle } from '@fortawesome/free-solid-svg-icons';

import { ChatUsersService } from '@services/chat-users/chat-users.service';
import { ChatService } from '@services/chat/chat.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-users',
  templateUrl: './chat-users.component.html',
  styleUrls: ['./chat-users.component.scss'],
})
export class ChatUsersComponent implements OnInit {
  @Input() currentUser: any;
  allUsers: any;
  token: any;
  canDisplayBadge = false;
  public newMessage: string;
  public unreadMessages: any = {};
  public users: Observable<any>;
  public messages: Observable<any>;
  public chatbox: any;
  public circleIcon = faDotCircle;

  selectedUser: any;

  constructor(
    public chatService: ChatService,
    public chatUserService: ChatUsersService
  ) {
    this.users = this.chatService.users;
    this.messages = this.chatService.messages;
  }
  ngOnInit(): void {

    this.chatUserService.fetchAllUsers();


    this.messages.subscribe((messages) => {

      if (this.canDisplayBadge) {

        const newMessage = messages[0]; // The newly received message

        if (
          (this.selectedUser &&
            this.selectedUser.id !== newMessage.fromId &&
            newMessage.toId === this.chatService.userId) ||
          (!this.selectedUser && newMessage.toId === this.chatService.userId)

        ) {

          this.unreadMessages[newMessage.fromId] = this.unreadMessages[
            newMessage.fromId] ? this.unreadMessages[newMessage.fromId] + 1 : 1;

        } else if (
          this.selectedUser &&
          this.selectedUser.id === newMessage.fromId
        ) {

          this.unreadMessages[newMessage.fromId] = 0;

        }
      } else {

        this.canDisplayBadge = true;

      }
    });
  }

  /**
   *
   * Sets the selected User.
   *
   * @param user The user Object.
   *
   */
  public setSelectedUser(user): void {

    this.selectedUser = user;

    this.unreadMessages[user.id] = '';

  }

  /**
   *
   * Returns Unread messages for the selected user.
   *
   * @param userEmail Returns unread messages for a user.
   */
  public getUnreadMessages(userEmail): any {

    return this.unreadMessages[userEmail];

  }
}
