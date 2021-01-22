import { Edge } from './Edge';
import { PageInfo } from './PageInfo';

export interface Connection<T> {
  totalCount: number;
  pageInfo: PageInfo;
  edges: Edge<T>[];
}
