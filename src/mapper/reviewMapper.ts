import mybatisMapper from 'mybatis-mapper';
import { Mysql as mysql } from '../config/mysql';
import { ReviewPostParam } from '../model/input/ReviewPostParam';
import serviceUtil from '../util/serviceUtil';

export default class reviewMapper {
  serviceUtil: serviceUtil;
  constructor(serviceUtil: serviceUtil) {
    mybatisMapper.createMapper(['resource/mapper/reviewMapper.xml']);
    this.serviceUtil = serviceUtil;
  }
  public async createReview(reviewInfo: ReviewPostParam): Promise<number> {
    const param = {
      meetingId: reviewInfo.meetingId,
      title: reviewInfo.title,
      content: reviewInfo.content,
    };
    const query = mybatisMapper.getStatement('reviewMapper', 'createReview', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return result[0].affectedRows;
  }

  public async getReview(id: number): Promise<JSON> {
    const param = { id: id };
    const query = mybatisMapper.getStatement('reviewMapper', 'getReview', param);
    const get = await mysql.connect((con: any) => con.query(query))();
    return get[0];
  }

  public async listMeetingReviews(meetingId: number, pageNum: number, pageSize: number): Promise<JSON> {
    const offset = this.serviceUtil.caculateOffset(pageNum, pageSize);
    const param = { meetingId: meetingId, offset: offset, pageSize: pageSize };
    const query = mybatisMapper.getStatement('reviewMapper', 'getHostReviews', param);
    const list = await mysql.connect((con: any) => con.query(query))();
    return list[0];
  }

  public async listUserReviews(userId: string, pageNum: number, pageSize: number): Promise<JSON> {
    const offset = this.serviceUtil.caculateOffset(pageNum, pageSize);
    const param = { userId: userId, offset: offset, pageSize: pageSize };
    const query = mybatisMapper.getStatement('reviewMapper', 'getAllReviews', param);
    const list = await mysql.connect((con: any) => con.query(query))();
    return list[0];
  }

  public async listReviews(pageNum: number, pageSize: number): Promise<JSON> {
    const offset = this.serviceUtil.caculateOffset(pageNum, pageSize);
    const param = { offset: offset, pageSize: pageSize };
    const query = mybatisMapper.getStatement('reviewMapper', 'getAllReviews', param);
    const list = await mysql.connect((con: any) => con.query(query))();
    return list[0];
  }

  public async deleteReview(id: number): Promise<number> {
    const param = { id: id };
    const query = mybatisMapper.getStatement('reviewMapper', 'deleteReview', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return result[0].affectedRows;
  }

  public async updateReview(id: number, reviewInfo: ReviewPostParam): Promise<number> {
    const param = {
      title: reviewInfo.title,
      content: reviewInfo.content,
    };
    const query = mybatisMapper.getStatement('reviewMapper', 'updateReview', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return result[0].affectedRows;
  }
}
