import { Mysql as mysql } from '../config/mysql';
import ServiceUtil from '../util/serviceUtil';
import { DBException } from '../util/customException';
import { Host } from '../model/Host';

export default class hostRepository {
  // DI
  private serviceUtil: ServiceUtil;
  constructor(serviceUtil: ServiceUtil) {
    this.serviceUtil = serviceUtil;
  }

  // select
  public async getHost(id: string): Promise<Host> {
    const param = [id];
    const sql = `
    SELECT
      id,
      nickname
    FROM
      host
    WHERE
      id = ? and status = 1
    `;
    const result = await mysql.connect(sql, param);
    if (this.serviceUtil.isEmpty(result) || this.serviceUtil.isEmpty(result[0])) {
      throw new DBException();
    }
    return result[0][0];
  }

  public async getAllHost(hostIds: readonly string[]): Promise<Host[]> {
    const param = [hostIds];
    const sql = `
    SELECT
      id, nickname
    FROM
      host
    WHERE
      id IN (?) and status = 1
    `;
    const result = await mysql.connect(sql, param);
    if (this.serviceUtil.isEmpty(result)) {
      throw new DBException();
    }
    return result[0];
  }
}
