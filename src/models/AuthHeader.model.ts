import { User } from './User.model';

export interface AuthHeader {
  user: User;
  iat: number;
  exp: number;
}
