import { PageValidate } from '../enum/PageValidate';

export interface Page {
  pageNum: number | PageValidate;
  pageSize: number | PageValidate;
  first: number | PageValidate;
  after: string | number | PageValidate;
}
