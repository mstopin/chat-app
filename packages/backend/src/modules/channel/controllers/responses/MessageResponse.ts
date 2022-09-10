import { Message } from '../../../message/entities/Message';

export class MessageResponse {
  static from(message: Message) {
    return {
      id: message.id,
      content: message.content,
      sender: {
        id: message.sender.id,
        name: message.sender.name,
        surname: message.sender.surname,
      },
      created_at: message.created_at,
    };
  }
}
