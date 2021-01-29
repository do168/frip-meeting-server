import { Mysql as mysql } from '../config/mysql';
import { ReviewPostParam } from '../model/input/ReviewPostParam';
import { Page } from '../model/Connections/Page';
import { Review } from '../model/resource/Review';
import { DBException, PagingException } from '../util/customException';
import ServiceUtil from '../util/serviceUtil';
import { PageValidate } from '../model/enum/PageValidate';

export default class reviewRepository {
  private serviceUtil: ServiceUtil;
  constructor(serviceUtil: ServiceUtil) {
    this.serviceUtil = serviceUtil;
  }
  public async createReview(reviewInfo: ReviewPostParam): Promise<number> {
    const param = [reviewInfo.meetingId, reviewInfo.userId, reviewInfo.title, reviewInfo.content];
    const sql = `
    insert into review(
      meetingId,
      userId,
      title,
      content
    )
    values(
      ?,
      ?,
      ?,
      ?
    )
    `;
    const result = await mysql.connect(sql, param);
    if (this.serviceUtil.isEmpty(result)) {
      throw new DBException();
    }
    return result[0].insertId || 0;
  }

  /* select query 시 리턴 값은
  [ [ TextRow { }], ... ,] 라서 get 함수에서는 result[0][0]을
  list 함수에서는 result[0]을 리턴한다.
  */
  public async getReview(id: number): Promise<Review> {
    const param = [id];
    const sql = `
    SELECT
      id,
      userId,
      title,
      content,
      updatedAt
    FROM
      review
    WHERE
      id = ? and status = 1
    `;
    const result = await mysql.connect(sql, param);
    if (this.serviceUtil.isEmpty(result) || this.serviceUtil.isEmpty(result[0])) {
      throw new DBException();
    }
    return result[0][0];
  }

  public async listMeetingReviews(meetingId: number, page: Page): Promise<Review[]> {
    if (
      page.first == PageValidate.INVALIDATE &&
      page.after == PageValidate.INVALIDATE &&
      page.pageNum != PageValidate.INVALIDATE &&
      page.pageSize != PageValidate.INVALIDATE
    ) {
      const offset = this.serviceUtil.caculateOffset(Number(page.pageNum), Number(page.pageSize));
      const param = [meetingId, offset, page.pageSize];
      const sql = `
    SELECT
      id,
      userId,
      title,
      content,
      updatedAt
    FROM
      review
    WHERE
      meetingId = ? and status = 1
    LIMIT ?, ?
    `;
      const result = await mysql.connect(sql, param);
      if (this.serviceUtil.isEmpty(result)) {
        throw new DBException();
      }
      return result[0];
    } else if (
      page.first != PageValidate.INVALIDATE &&
      page.after != PageValidate.INVALIDATE &&
      page.pageNum == PageValidate.INVALIDATE &&
      page.pageSize == PageValidate.INVALIDATE
    ) {
      const param = [meetingId, Number(page.after), Number(page.first)];
      const sql = `
    SELECT
      id,
      userId,
      title,
      content,
      updatedAt
    FROM
      review
    WHERE
      meetingId = ? and id < ? and status = 1
    ORDER BY id DESC 
    LIMIT ?
    `;
      const result = await mysql.connect(sql, param);
      if (this.serviceUtil.isEmpty(result)) {
        throw new DBException();
      }
      return result[0];
    } else if (
      page.first != PageValidate.INVALIDATE &&
      page.after == PageValidate.INVALIDATE &&
      page.pageNum == PageValidate.INVALIDATE &&
      page.pageSize == PageValidate.INVALIDATE
    ) {
      const param = [meetingId, Number(page.first)];
      const sql = `
    SELECT
      id,
      userId,
      title,
      content,
      updatedAt
    FROM
      review
    WHERE
      meetingId = ? and status = 1
    ORDER BY id DESC 
    LIMIT ?
    `;
      const result = await mysql.connect(sql, param);
      if (this.serviceUtil.isEmpty(result)) {
        throw new DBException();
      }
      return result[0];
    } else {
      throw new PagingException();
    }
  }

  public async listUserReviews(userId: string, page: Page): Promise<Review[]> {
    if (
      page.first == PageValidate.INVALIDATE &&
      page.after == PageValidate.INVALIDATE &&
      page.pageNum != PageValidate.INVALIDATE &&
      page.pageSize != PageValidate.INVALIDATE
    ) {
      const offset = this.serviceUtil.caculateOffset(Number(page.pageNum), Number(page.pageSize));
      const param = [userId, offset, page.pageSize];
      const sql = `
    select
      id,
      userId,
      title,
      content,
      updatedAt
    FROM
      review
    WHERE
      userId = ? and status = 1
    LIMIT ?, ?
    `;
      const result = await mysql.connect(sql, param);
      if (this.serviceUtil.isEmpty(result)) {
        throw new DBException();
      }
      return result[0];
    } else if (
      page.first != PageValidate.INVALIDATE &&
      page.after != PageValidate.INVALIDATE &&
      page.pageNum == PageValidate.INVALIDATE &&
      page.pageSize == PageValidate.INVALIDATE
    ) {
      const param = [userId, Number(page.after), Number(page.first)];
      const sql = `
    select
      id,
      userId,
      title,
      content,
      updatedAt
    FROM
      review
    WHERE
      userId = ? and id < ? and status = 1
    ORDER BY id DESC
    LIMIT ?
    `;
      const result = await mysql.connect(sql, param);
      if (this.serviceUtil.isEmpty(result)) {
        throw new DBException();
      }
      return result[0];
    } else if (
      page.first != PageValidate.INVALIDATE &&
      page.after == PageValidate.INVALIDATE &&
      page.pageNum == PageValidate.INVALIDATE &&
      page.pageSize == PageValidate.INVALIDATE
    ) {
      const param = [userId, Number(page.first)];
      const sql = `
    select
      id,
      userId,
      title,
      content,
      updatedAt
    FROM
      review
    WHERE
      userId = ? and status = 1
    ORDER BY id DESC
    LIMIT ?
    `;
      const result = await mysql.connect(sql, param);
      if (this.serviceUtil.isEmpty(result)) {
        throw new DBException();
      }
      return result[0];
    } else {
      throw new PagingException();
    }
  }

  public async listReviews(page: Page): Promise<Review[]> {
    if (
      page.first == PageValidate.INVALIDATE &&
      page.after == PageValidate.INVALIDATE &&
      page.pageNum != PageValidate.INVALIDATE &&
      page.pageSize != PageValidate.INVALIDATE
    ) {
      const offset = this.serviceUtil.caculateOffset(Number(page.pageNum), Number(page.pageSize));
      const param = [offset, page.pageSize];
      const sql = `
    select
      id,
      userId,
      title,
      content,
      updatedAt
    FROM
      review
    WHERE
      status = 1
    LIMIT ?, ?
    `;
      const result = await mysql.connect(sql, param);
      if (this.serviceUtil.isEmpty(result)) {
        throw new DBException();
      }
      return result[0];
    } else if (
      page.first != PageValidate.INVALIDATE &&
      page.after != PageValidate.INVALIDATE &&
      page.pageNum == PageValidate.INVALIDATE &&
      page.pageSize == PageValidate.INVALIDATE
    ) {
      const param = [Number(page.after), Number(page.first)];
      const sql = `
    select
      id,
      userId,
      title,
      content,
      updatedAt
    FROM
      review
    WHERE
      id < ? and status = 1
    ORDER BY id DESC
    LIMIT ?
    `;
      const result = await mysql.connect(sql, param);
      if (this.serviceUtil.isEmpty(result)) {
        throw new DBException();
      }
      return result[0];
    } else if (
      page.first != PageValidate.INVALIDATE &&
      page.after == PageValidate.INVALIDATE &&
      page.pageNum == PageValidate.INVALIDATE &&
      page.pageSize == PageValidate.INVALIDATE
    ) {
      const param = [Number(page.first)];
      const sql = `
    select
      id,
      userId,
      title,
      content,
      updatedAt
    FROM
      review
    WHERE
      status = 1
    ORDER BY id DESC
    LIMIT ?
    `;
      const result = await mysql.connect(sql, param);
      if (this.serviceUtil.isEmpty(result)) {
        throw new DBException();
      }
      return result[0];
    } else {
      throw new PagingException();
    }
  }

  public async listAllMeetingReviews(meetingIds: readonly number[]): Promise<Review[]> {
    const sql = `
    SELECT
      id,
      title,
      content,
      updatedAt
    FROM
      review
    WHERE
      meetingId In (${meetingIds}) and status = 1
    ORDER BY updatedAt DESC
    LIMIT 100
    `;
    const result = await mysql.connect(sql);
    if (this.serviceUtil.isEmpty(result)) {
      throw new Error();
    }
    return result[0] as Review[];
  }

  public async listAllUserReviews(userIdㄴ: readonly string[]): Promise<Review[]> {
    const sql = `
    SELECT
      id,
      userId,
      title,
      content,
      updatedAt
    FROM
      review
    WHERE
      uesrId In (${userIdㄴ}) and status = 1
    LIMIT 100
    `;
    const [result] = await mysql.connect(sql);
    if (this.serviceUtil.isEmpty(result)) {
      throw new Error();
    }
    return result as Review[];
  }

  public async deleteReview(id: number): Promise<number> {
    const param = [id];
    const sql = `
    update 
      review
    set 
      status = 0
    where 
      id = ?
    `;
    const result = await mysql.connect(sql, param);
    if (this.serviceUtil.isEmpty(result)) {
      throw new DBException();
    }
    return result[0].affectedRows;
  }

  public async updateReview(id: number, reviewInfo: ReviewPostParam): Promise<number> {
    const param = [reviewInfo.title, reviewInfo.content, id];
    const sql = `
    update 
      review
    set 
      title = ?,
      content = ?
    where 
      id = ?
    `;
    const result = await mysql.connect(sql, param);
    if (this.serviceUtil.isEmpty(result)) {
      throw new DBException();
    }
    return result[0].affectedRows;
  }

  public async getLastId(): Promise<number> {
    const sql = `
    select 
      max(id) as max
    FROM
      review
    where
      status = 1
    `;
    const result = await mysql.connect(sql);
    if (this.serviceUtil.isEmpty(result) || this.serviceUtil.isEmpty(result[0])) {
      throw new DBException();
    }
    return result[0][0].max;
  }
}
