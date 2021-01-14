import mybatisMapper from 'mybatis-mapper';
import { Mysql as mysql } from '../config/mysql';
import { MeetingPostParam } from '../model/input/MeetingPostParam';
import { Meeting } from '../model/Meeting';
import ServiceUtil from '../util/serviceUtil';

export default class meetingMapper {
  // DI
  serviceUtil: ServiceUtil;
  constructor(serviceUtil: ServiceUtil) {
    mybatisMapper.createMapper(['resource/mapper/meetingMapper.xml']);
    this.serviceUtil = serviceUtil;
  }

  // insert
  public async createMeeting(meetingInfo: MeetingPostParam): Promise<Array<Number>> {
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
    return [result[0].affectedRows, result[0].insertId];
  }

  /* select query 시 리턴 값은
  [ [ TextRow { }], ... ,] 라서 get 함수에서는 result[0][0]을
  list 함수에서는 result[0]을 리턴한다.
  */

  // select
  public async getMeeting(id: number): Promise<Meeting> {
    const param = { id };
    const query = mybatisMapper.getStatement('meetingMapper', 'getMeeting', param);
    const result = await mysql.connect((con: any) => con.query(query))();
    return result[0][0];
  }

  // select
  public async listHostMeetings(hostId: string, pageNum: number, pageSize: number): Promise<Array<Meeting>> {
    const offset = this.serviceUtil.caculateOffset(pageNum, pageSize);
    const param = { hostId, offset, pageSize };
    const query = mybatisMapper.getStatement('meetingMapper', 'listHostMeetings', param);
    const result = await mysql.connect((con: any) => con.query(query))();
    return result[0];
  }

  // select
  public async listMeetings(pageNum: number, pageSize: number): Promise<Array<Meeting>> {
    const offset = this.serviceUtil.caculateOffset(pageNum, pageSize);
    const param = { offset, pageSize };
    const query = mybatisMapper.getStatement('meetingMapper', 'listMeetings', param);
    const result = await mysql.connect((con: any) => con.query(query))();
    return result[0];
  }

  // delete
  public async deleteMeeting(id: number): Promise<Number> {
    const param = { id };
    const query = mybatisMapper.getStatement('meetingMapper', 'deleteMeeting', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return result[0].affectedRows[0];
  }

  // update
  public async updateMeeting(id: number, meetingInfo: MeetingPostParam): Promise<Number> {
    const param = {
      id,
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
  public async createMeetingParticipation(id: number, userId: string): Promise<Array<Number>> {
    const param = { id, userId };
    const query = await mybatisMapper.getStatement('meetingMapper', 'createMeetingParticipation', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return [result[0].affectedRows, result[0].insertId];
  }

  // delete
  public async deleteMeetingParticipation(id: number, userId: string): Promise<Number> {
    const param = { meetingId: id, userId };
    const query = mybatisMapper.getStatement('meetingMapper', 'deleteMeetingParticipation', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return result[0].affectedRows[0];
  }

  // update - 출석 체크
  public async updateMeetingAttendance(id: number, userId: string): Promise<Number> {
    const param = { meetingId: id, userId };
    const query = mybatisMapper.getStatement('meetingMapper', 'updateMeetingAttendance', param);
    const result = await mysql.transaction((con: any) => con.query(query))();
    return result[0].affectedRows[0];
  }

  // select 현재 참가 신청 인원
  public async getCntMeetingParticipant(id: number): Promise<Number> {
    const param = { meetingId: id };
    const query = mybatisMapper.getStatement('meetingMapper', 'getCntMeetingParticipant', param);
    const result = await mysql.connect((con: any) => con.query(query))();
    return result[0][0];
  }

  // select 리뷰 조건 검사
  public async isAttendee(id: number, userId: string): Promise<Boolean> {
    const param = { meetingId: id, userId };
    const query = mybatisMapper.getStatement('meetingMapper', 'getAttendance', param);
    const result = await mysql.connect((con: any) => con.query(query))();
    return result[0][0] == 1;
  }
}
