import { useMemo } from 'react';
import dayjs from 'dayjs';

import { Message } from '../../../../../types';

interface DateDividedMessages {
  date: string;
  messages: Message[];
}

export function useDateDividedMessages(messages: Message[]) {
  const MAX_MINUTES_BEFORE_DIVISION = 10;

  const shouldDivideMessages = (message: Message, lastMessage: Message) => {
    const timeDiffInMinutes = dayjs(message.created_at).diff(
      dayjs(lastMessage.created_at),
      'minute',
      true
    );
    return timeDiffInMinutes > MAX_MINUTES_BEFORE_DIVISION;
  };

  return useMemo(() => {
    const dateDividedMessages: DateDividedMessages[] = [];

    messages.forEach((message) => {
      const lastMessage = dateDividedMessages.at(-1)?.messages.at(-1);

      if (!lastMessage || shouldDivideMessages(message, lastMessage)) {
        dateDividedMessages.push({
          date: dayjs(message.created_at).format('DD.MM.YYYY HH:mm:ss'),
          messages: [message],
        });
      } else {
        dateDividedMessages.at(-1)!.messages.push(message);
      }
    });
    return dateDividedMessages;
  }, [messages]);
}
