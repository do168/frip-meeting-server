import { PageInfo } from './input/PageInfo';
import { MeetingEdge } from './MeetingEdge';

export interface MeetingConnection {
  totalCount: number;
  pageInfo: PageInfo;
  edges: MeetingEdge[];
}
