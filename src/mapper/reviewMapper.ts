import mybatisMapper from 'mybatis-mapper';
import { Mysql as mysql } from '../config/mysql';
import { ReviewPostParam } from '../model/input/ReviewPostParam';
import { Review } from '../model/Review';
import serviceUtil from '../util/serviceUtil';

export default class reviewMapper {
  serviceUtil: serviceUtil;
  constructor(serviceUtil: serviceUtil) {
    mybatisMapper.createMapper(['resource/mapper/reviewMapper.xml']);
    this.serviceUtil = serviceUtil;
  }
  public async createReview(reviewInfo: ReviewPostParam): Promise<Array<Number>> {
    const param = {
      meetingId: reviewInfo.meetingId,
      title: reviewInfo.title,
      content: reviewInfo.content,
    };
    const query = mybatisMapper.getStatement('reviewMapper', 'createReview', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return [result[0].affectedRows, result[0].insertId];
  }

  /* select query 시 리턴 값은
  [ [ TextRow { }], ... ,] 라서 get 함수에서는 result[0][0]을
  list 함수에서는 result[0]을 리턴한다.
  */
  public async getReview(id: number): Promise<Review> {
    const param = { id: id };
    const query = mybatisMapper.getStatement('reviewMapper', 'getReview', param);
    const result = await mysql.connect((con: any) => con.query(query))();
    return result[0][0];
  }

  public async listMeetingReviews(meetingId: number, pageNum: number, pageSize: number): Promise<Array<Review>> {
    const offset = this.serviceUtil.caculateOffset(pageNum, pageSize);
    const param = { meetingId: meetingId, offset: offset, pageSize: pageSize };
    const query = mybatisMapper.getStatement('reviewMapper', 'getHostReviews', param);
    const result = await mysql.connect((con: any) => con.query(query))();
    return result[0];
  }

  public async listUserReviews(userId: string, pageNum: number, pageSize: number): Promise<Array<Review>> {
    const offset = this.serviceUtil.caculateOffset(pageNum, pageSize);
    const param = { userId: userId, offset: offset, pageSize: pageSize };
    const query = mybatisMapper.getStatement('reviewMapper', 'getAllReviews', param);
    const result = await mysql.connect((con: any) => con.query(query))();
    return result[0];
  }

  public async listReviews(pageNum: number, pageSize: number): Promise<Array<Review>> {
    const offset = this.serviceUtil.caculateOffset(pageNum, pageSize);
    const param = { offset: offset, pageSize: pageSize };
    const query = mybatisMapper.getStatement('reviewMapper', 'getAllReviews', param);
    const result = await mysql.connect((con: any) => con.query(query))();
    return result[0];
  }

  public async deleteReview(id: number): Promise<Number> {
    const param = { id: id };
    const query = mybatisMapper.getStatement('reviewMapper', 'deleteReview', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return result[0].affectedRows;
  }

  public async updateReview(id: number, reviewInfo: ReviewPostParam): Promise<Number> {
    const param = {
      title: reviewInfo.title,
      content: reviewInfo.content,
    };
    const query = mybatisMapper.getStatement('reviewMapper', 'updateReview', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return result[0].affectedRows;
  }
}
