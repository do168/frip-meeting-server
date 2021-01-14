import mybatisMapper from 'mybatis-mapper';
import { Mysql as mysql } from '../config/mysql';
import { MeetingPostParam } from '../model/input/MeetingPostParam';
import { meetingDto } from '../model/meetingDto';
import serviceUtil from '../util/serviceUtil';

export default class meetingMapper {
  // DI
  serviceUtil: serviceUtil;
  constructor(serviceUtil: serviceUtil) {
    mybatisMapper.createMapper(['resource/mapper/meetingMapper.xml']);
    this.serviceUtil = serviceUtil;
  }

  // insert
  public async createMeeting(meetingInfo: MeetingPostParam): Promise<number> {
    const param = {
      hostId: meetingInfo.hostId,
      title: meetingInfo.title,
      content: meetingInfo.content,
      startAt: meetingInfo.startAt,
      endAt: meetingInfo.endAt,
      deadline: meetingInfo.deadline,
      maxParticipant: meetingInfo.maxParticipant,
      place: meetingInfo.place,
    };
    const query = await mybatisMapper.getStatement('meetingMapper', 'createMeeting', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return result[0].affectedRows;
  }

  // select
  public async getMeeting(id: number): Promise<meetingDto> {
    const param = { id: id };
    const query = mybatisMapper.getStatement('meetingMapper', 'getMeeting', param);
    const get = await mysql.connect((con: any) => con.query(query))();
    return get[0];
  }

  // select
  public async listHostMeetings(hostId: string, pageNum: number, pageSize: number): Promise<JSON> {
    const offset = this.serviceUtil.caculateOffset(pageNum, pageSize);
    const param = { hostId: hostId, offset: offset, pageSize: pageSize };
    const query = mybatisMapper.getStatement('meetingMapper', 'listHostMeetings', param);
    const list = await mysql.connect((con: any) => con.query(query))();
    return list[0];
  }

  // select
  public async listMeetings(pageNum: number, pageSize: number): Promise<JSON> {
    const offset = this.serviceUtil.caculateOffset(pageNum, pageSize);
    const param = { offset: offset, pageSize: pageSize };
    const query = mybatisMapper.getStatement('meetingMapper', 'listMeetings', param);
    const list = await mysql.connect((con: any) => con.query(query))();
    return list[0];
  }

  // delete
  public async deleteMeeting(id: number): Promise<number> {
    const param = { id: id };
    const query = mybatisMapper.getStatement('meetingMapper', 'deleteMeeting', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return result[0].affectedRows[0];
  }

  // update
  public async updateMeeting(id: number, meetingInfo: MeetingPostParam): Promise<number> {
    const param = {
      id: id,
      title: meetingInfo.title,
      content: meetingInfo.content,
      startAt: meetingInfo.startAt,
      endAt: meetingInfo.endAt,
      deadline: meetingInfo.deadline,
      maxParticipant: meetingInfo.maxParticipant,
      place: meetingInfo.place,
    };
    const query = mybatisMapper.getStatement('meetingMapper', 'updateMeeting', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    console.log('업데이트 로그 : ', result[0]);
    return result[0].affectedRows[0];
  }

  // insert
  public async createMeetingParticipation(id: number, userId: string): Promise<number> {
    const param = { id: id, userId: userId };
    const query = await mybatisMapper.getStatement('meetingMapper', 'createMeetingParticipation', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return result[0].affectedRows;
  }

  // delete
  public async deleteMeetingParticipation(participationId: number, userId: string): Promise<number> {
    const param = { id: participationId, userId: userId };
    const query = mybatisMapper.getStatement('meetingMapper', 'deleteMeetingParticipation', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return result[0].affectedRows[0];
  }

  // select
  public async getCntMeetingParticipant(id: number): Promise<number> {
    const param = { meetingId: id };
    const query = mybatisMapper.getStatement('meetingMapper', 'selectCntMeetingParticipant', param);
    const result = await mysql.connect((con: any) => con.query(query))();
    return result[0];
  }
}
