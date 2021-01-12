import mybatisMapper from 'mybatis-mapper';
import { Mysql as mysql } from '../config/mysql';
import { meetingPostParam } from '../model/input/meetingPostParam';
import { meetingDto } from '../model/meetingDto';

export default class meetingMapper {
  constructor() {
    mybatisMapper.createMapper(['resource/mapper/meetingMapper.xml']);
  }
  public async createMeeting(params: meetingPostParam): Promise<number> {
    try {
      const param = {title: params.title, 
        content: params.content,
        startAt: params.startAt,
        endAt: params.endAt,
        deadline: params.deadline,
        maxParticipant: params.maxParticipant,
        place: params.place }
      const query = await mybatisMapper.getStatement('meetingMapper', 'createMeeting', param);
      const result = await mysql.transaction((con: any) => con.query(query))();
      return result[0].affectedRows;
    } catch (error) {
      throw error;
    }
  }

  public async getMeeting(id: number): Promise<meetingDto> {
    try {
      const param = { id: id };
      const query = mybatisMapper.getStatement('meetingMapper', 'getMeeting', param);
      const get = await mysql.connect((con: any) => con.query(query))();
      return get[0];
    } catch (error) {
      throw error;
    }
  }

  public async listHostMeetings(hostId: string, offset: number, pageSize: number): Promise<JSON> {
    try {
      const param = { hostId: hostId, offset: offset, pageSize: pageSize };
      const query = mybatisMapper.getStatement('meetingMapper', 'listHostMeetings', param);
      console.log(query);
      const get = await mysql.connect((con: any) => con.query(query))();
      return get[0]; 
    } catch (error) {
      throw error;
    }
  }

  public async listMeetings(offset: number, pageSize: number): Promise<JSON> {
    try {
      const param = { offset: offset, pageSize: pageSize };
      const query = mybatisMapper.getStatement('meetingMapper', 'listMeetings', param);
      const get = await mysql.connect((con: any) => con.query(query))();
      return get[0];
    } catch (error) {
      throw error;
    }
  }

  public async deleteMeeting(id: number): Promise<number> {
    try {
      const param = {id: id};
      const query = mybatisMapper.getStatement('meetingMapper', 'deleteMeeting', param);
      const result = await mysql.transaction((con: any) => con.query(query))();
      return result[0].affectedRows[0];
    } catch (error) {
      throw error;
    }
  }

  public async updateMeeting(id: number, body: meetingPostParam): Promise<number> {
    try {
      const param = {
        id: id,
        title: body.title, 
        content: body.content,
        startAt: body.startAt,
        endAt: body.endAt,
        deadline: body.deadline,
        maxParticipant: body.maxParticipant,
        place: body.place };
      const query = mybatisMapper.getStatement('meetingMapper', 'updateMeeting', param);
      const result = await mysql.transaction((con: any) => con.query(query))();
      console.log("업데이트 로그 : ", result[0]);
      return result[0].affectedRows[0];
    } catch (error) {
      throw error;
    }
  }

  public async createMeetingParticipation(id: number, userId: string): Promise<number> {
    try {
      const param = {id: id, userId: userId};
      const query = await mybatisMapper.getStatement('meetingMapper', 'createMeetingParticipation', param);
      const result = await mysql.transaction((con: any) => con.query(query))();
      return result[0].affectedRows; 
    } catch (error) {
      throw error;
    }
  }

  public async deleteMeetingParticipation(participationId: number, userId: string): Promise<number> {
    try {
      const param = {participationId: participationId, userId: userId};
      const query = mybatisMapper.getStatement('meetingMapper', 'deleteMeetingParticipation', param);
      const result = await mysql.transaction((con: any) => con.query(query))();
      return result[0].affectedRows[0]; 
    } catch (error) {
      throw error;
    }
  }
}
