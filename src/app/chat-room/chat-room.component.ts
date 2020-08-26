import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})

export class ChatRoomComponent {

  @Input() user: any;
  public newMessage: string;
  public messages: Observable<any>;
  public chatbox: any;
  constructor(public auth: AuthService, public afService: ChatService) {
    this.messages = this.afService.messages;
  }

  sendMessage(): void {
    this.afService.sendMessage(this.user.chatmessage, this.user.email);
    this.user.chatmessage = '';
  }

  getMessageCls(message): string {
    return message.to === this.afService.email ? 'chat-receiver' : '';
  }

  isSenderOrReceiver(message): boolean {
    return (message.to === this.afService.email && message.email === this.user.email) ||
      (message.email === this.afService.email && message.to === this.user.email);
  }

}
