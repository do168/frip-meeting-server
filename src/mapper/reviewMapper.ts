import mybatisMapper from 'mybatis-mapper';
import { Mysql as mysql } from '../config/mysql';
import { reviewPostParam } from '../model/input/reviewPostParam';
// import { reviewDto } from '../model/reviewDto';

export default class reviewMapper {
  constructor() {
    mybatisMapper.createMapper(['resource/mapper/reviewMapper.xml']);
  }
  public async createReview(params: reviewPostParam): Promise<number> {
    try {
      const param = {
        meetingId: params.meetingId,
        title: params.title, 
        content: params.content,
         }
      const query = mybatisMapper.getStatement('reviewMapper', 'createReview', param);
      const result = await mysql.transaction((con: any) => con.query(query))();
      return result[0].affectedRows;
    } catch (error) {
      throw error;
    }
  }

  public async getReview(id: number): Promise<JSON> {
    try {
      const param = { id: id };
      const query = mybatisMapper.getStatement('reviewMapper', 'getReview', param);
      const get = await mysql.connect((con: any) => con.query(query))();
      return get[0];
    } catch (error) {
      throw error;
    }
  }

  public async listMeetingReviews(meetingId: number): Promise<JSON> {
    try {
      const param = { meetingId: meetingId };
      const query = mybatisMapper.getStatement('reviewMapper', 'getHostReviews', param);
      const get = await mysql.connect((con: any) => con.query(query))();
      return get[0];
    } catch (error) {
      throw error;
    }
  }

  public async listUserReviews(userId: string): Promise<JSON> {
    try {
      const param = {userId: userId};
      const query = mybatisMapper.getStatement('reviewMapper', 'getAllReviews', param);
      const get = await mysql.connect((con: any) => con.query(query))();
      return get[0];
    } catch (error) {
      throw error;
    }
  }

  public async listReviews(): Promise<JSON> {
    try {
      const query = mybatisMapper.getStatement('reviewMapper', 'getAllReviews');
      const get = await mysql.connect((con: any) => con.query(query))();
      return get[0];
    } catch (error) {
      throw error;
    }
  }

  public async deleteReview(id: number): Promise<number> {
    try {
      const param = {id: id};
      const query = mybatisMapper.getStatement('reviewMapper', 'deleteReview', param);
      const result = await mysql.transaction((con: any) => con.query(query))();
      return result[0].affectedRows;
    } catch (error) {
      throw error;
    }
  }

  public async updateReview(id: number, body: reviewPostParam): Promise<number> {
    try {
      const param = {
        title: body.title, 
        content: body.content,
      };
      const query = mybatisMapper.getStatement('reviewMapper', 'updateReview', param);
      const result = await mysql.transaction((con: any) => con.query(query))();
      return result[0].affectedRows;
    } catch (error) {
      throw error;
    }
  }
}
