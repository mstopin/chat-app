import { Session } from './Session';

declare module 'express' {
  interface Request {
    session: Session;
  }
}
