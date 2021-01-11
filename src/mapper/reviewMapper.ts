import mybatisMapper from 'mybatis-mapper';
import { Mysql as mysql } from '../config/mysql';
import { reviewPostParam } from '../model/input/reviewPostParam';
// import { reviewDto } from '../model/reviewDto';

export default class reviewMapper {
  constructor() {
    mybatisMapper.createMapper(['resource/mapper/reviewMapper.xml']);
  }
  public async createReview(params: reviewPostParam): Promise<JSON> {
    try {
      const param = {
        meetingId: params.meetingId,
        title: params.title, 
        content: params.content,
         }
      const query = mybatisMapper.getStatement('reviewMapper', 'createReview', param);
      const post = await mysql.transaction((con: any) => con.query(query))();
      return post[0];
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

  public async deleteReview(id: number): Promise<JSON> {
    try {
      const param = {id: id};
      const query = mybatisMapper.getStatement('reviewMapper', 'deleteReview', param);
      const get = await mysql.transaction((con: any) => con.query(query))();
      return get[0];
    } catch (error) {
      throw error;
    }
  }

  public async updateReview(id: number, body: reviewPostParam): Promise<JSON> {
    try {
      const param = {
        title: body.title, 
        content: body.content,
      };
      const query = mybatisMapper.getStatement('reviewMapper', 'updateReview', param);
      const update = await mysql.transaction((con: any) => con.query(query))();
      return update[0];
    } catch (error) {
      throw error;
    }
  }
}
