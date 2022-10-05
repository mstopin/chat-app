// export interface Event<T extends Record<string, any> = Record<string, any>> {
//   type: string;
//   recipientIds: string[];
//   payload: T;
// }

export abstract class Event<T = unknown> {
  constructor(
    private type: string,
    private recipientIds: string[],
    private payload: T
  ) {}

  getType() {
    return this.type;
  }

  getRecipientIds() {
    return this.recipientIds;
  }

  getPayload() {
    return this.payload;
  }

  serialize() {
    return JSON.stringify({
      type: this.type,
      recipientIds: this.recipientIds,
      payload: this.payload,
    });
  }
}
