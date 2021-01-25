import { Meeting } from './Meeting';
import { User } from './User';

export interface Participation {
  meeting: Meeting;
  user: User;
}
