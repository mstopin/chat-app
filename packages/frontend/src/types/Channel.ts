import { User } from './User';

export interface Channel {
  id: string;
  name: string;
  hasPassword: boolean;
  owner: User;
  members: User[];
  deleted?: boolean;
}
