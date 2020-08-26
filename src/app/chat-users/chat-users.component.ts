import { Component, OnInit, Input } from '@angular/core';

import { ChatService } from '../services/chat/chat.service';
import { Observable } from 'rxjs';
import { ChatUsersService } from '../services/chat-users/chat-users.service';
import { faCircle, faDotCircle } from '@fortawesome/free-solid-svg-icons';


const selectedUserClass = 'bg-info text-white';

@Component({
  selector: 'app-chat-users',
  templateUrl: './chat-users.component.html',
  styleUrls: ['./chat-users.component.scss']
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

  processClasses(user): string {
    // CSS classes: added/removed per current state of component properties
    return this.selectedUser && user.email === this.selectedUser.email ? selectedUserClass : '';
  }
  constructor(public chatService: ChatService, public chatUserService: ChatUsersService) {
    this.users = this.chatService.users;
    this.messages = this.chatService.messages;
  }
  ngOnInit(): void {

    console.log('current user', this.currentUser);

    this.getAllUsers();

    const ctxt = this
      ;
    this.messages.subscribe(messages => {

      if (ctxt.canDisplayBadge) {

        const newMessage = messages[messages.length - 1]; // The newly received message

        // tslint:disable-next-line: max-line-length
        if ((ctxt.selectedUser && ctxt.selectedUser.email !== newMessage.email && newMessage.to === this.chatService.email) || (!ctxt.selectedUser
          && newMessage.to === this.chatService.email)

        ) {

          ctxt.unreadMessages[newMessage.email] = ctxt.unreadMessages[newMessage.email] ? ctxt.unreadMessages[newMessage.email] + 1 : 1;

        } else if (ctxt.selectedUser && ctxt.selectedUser.email === newMessage.to) {

          ctxt.unreadMessages[newMessage.email] = 0;

        }
      }
      else {

        ctxt.canDisplayBadge = true;

      }
    });
  }
  getAllUsers(): void {
    this.chatUserService.getAllUsers();
  }
  onSelect(user): void {
    this.selectedUser = user;
    this.unreadMessages[user.email] = '';
  }
  processNewMessages(messages: any): void {

    for (const message of messages) {

      if (this.selectedUser.email !== message.to) {

        this.unreadMessages[message.to] = this.unreadMessages[message.to] + 1;
      }
      else {
        this.unreadMessages[message.to] = 0;
      }
    }

  }
  getUnreadMessages(userEmail): any {

    return this.unreadMessages[userEmail];
  }

}

