import { Component, Input } from '@angular/core';

import { AuthService } from '@services/auth/auth.service';
import { ChatService } from '@services/chat/chat.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent {
  @Input() user: any;
  public newMessage: string;
  public messages: Observable<any>;
  public chatbox: any;
  constructor(public auth: AuthService, public afService: ChatService) {
    this.messages = this.afService.messages;
  }

  /**
   *
   * Sends a message to a user.
   *
   */
  public sendMessage(): void {

    this.afService.sendMessage(this.user.chatmessage, this.user.id);

    this.user.chatmessage = '';
  }

  /**
   *
   * Returns if the current user is either a sender or a recepient of the message.
   *
   * @param message The incoming message
   *
   */
  isSenderOrReceiver(message): boolean {
    return (
      (message.toId === this.afService.userId &&
        message.fromId === this.user.id) ||
      (message.fromId === this.afService.userId && message.toId === this.user.id)
    );
  }
}
