export interface Event<T extends Record<string, any> = Record<string, any>> {
  type: string;
  recipientIds: string[];
  payload: T;
}