import { Mysql as mysql } from '../config/mysql';
import { MeetingPostParam } from '../model/input/MeetingPostParam';
import { Meeting } from '../model/Meeting';
import ServiceUtil from '../util/serviceUtil';
import { Page } from '../model/Page';
import { DBException } from '../util/customException';

export default class meetingRepository {
  // DI
  private serviceUtil: ServiceUtil;
  constructor(serviceUtil: ServiceUtil) {
    this.serviceUtil = serviceUtil;
  }

  // insert
  public async createMeeting(meetingInfo: MeetingPostParam): Promise<number> {
    const param = [
      meetingInfo.hostId,
      meetingInfo.title,
      meetingInfo.content,
      meetingInfo.startAt,
      meetingInfo.endAt,
      meetingInfo.deadline,
      meetingInfo.maxParticipant,
      meetingInfo.place,
    ];
    const sql = `
    insert into meeting(
      hostId,
      title,
      content,
      startAt,
      endAt,
      deadline,
      maxParticipant,
      place)
    values(
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
    )`;
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

  // select
  public async getMeeting(id: number): Promise<Meeting> {
    const param = [id, id];
    const sql = `
    SELECT
      id,
      hostId,
      title,
      content,
      startAt,
      endAt,
      deadline,
      updatedAt,
      maxParticipant,
      place,
      (SELECT 
        count(*)
      FROM
        participatesMeeting
      WHERE meetingId = ?) as cntCurrentParticipant   
    FROM
      meeting
    WHERE
      id = ? and status = 1
    `;
    const result = await mysql.connect(sql, param);
    if (this.serviceUtil.isEmpty(result) || this.serviceUtil.isEmpty(result[0])) {
      throw new DBException();
    }
    return result[0][0];
  }

  // select
  public async listHostMeetings(hostId: string, page: Page): Promise<Meeting[]> {
    const offset = this.serviceUtil.caculateOffset(page.pageNum, page.pageSize);
    const param = [hostId, offset, page.pageSize];
    const sql = `
    SELECT
      id, 
      hostId,
      title, 
      content,
      startAt,
      endAt,
      deadline,
      maxParticipant,
      place,
      updatedAt
    FROM
      meeting
    WHERE
      hostId = ? and status = 1
    LIMIT ?, ?
    `;
    const result = await mysql.connect(sql, param);
    return result[0];
  }

  // select
  public async listMeetings(page: Page): Promise<Array<Meeting>> {
    const offset = this.serviceUtil.caculateOffset(page.pageNum, page.pageSize);
    const param = [offset, page.pageSize];
    const sql = `
    SELECT
      id, 
      hostId,
      title, 
      content,
      startAt,
      endAt,
      deadline,
      maxParticipant,
      place,
      updatedAt
    FROM
      meeting  
    WHERE
      status = 1
    LIMIT ?, ?
    `;
    const result = await mysql.connect(sql, param);
    if (this.serviceUtil.isEmpty(result)) {
      throw new DBException();
    }
    return result[0];
  }

  // delete
  public async deleteMeeting(id: number): Promise<number> {
    const param = [id];
    const sql = `
    update 
      meeting
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

  // update
  public async updateMeeting(id: number, meetingInfo: MeetingPostParam): Promise<number> {
    const param = [
      meetingInfo.title,
      meetingInfo.content,
      meetingInfo.startAt,
      meetingInfo.endAt,
      meetingInfo.deadline,
      meetingInfo.maxParticipant,
      meetingInfo.place,
      id,
    ];
    const sql = `
    update
      meeting
    set
      title = ?,
      content = ?,
      startAt = STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'),
      endAt = STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'),
      deadline = STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'),
      maxParticipant = ?,
      place = ?
    where
      id = ?
    `;
    const result = await mysql.connect(sql, param);

    if (this.serviceUtil.isEmpty(result)) {
      throw new DBException();
    }
    return result[0].affectedRows;
  }

  // insert
  public async createMeetingParticipation(id: number, userId: string): Promise<number> {
    const param = [id, userId];
    const sql = `
    insert into participatesMeeting(
      meetingId,
      userId
    )
    values(
      ?,
      ?
    )
    `;
    const result = await mysql.connect(sql, param);

    if (this.serviceUtil.isEmpty(result)) {
      throw new Error();
    }
    return result[0].insertId || 0;
  }

  // delete
  public async deleteMeetingParticipation(id: number, userId: string): Promise<number> {
    const param = [id, userId];
    const sql = `
    update 
      participatesMeeting
    set
      status = 0
    where 
      meetingId = ? and userId = ?
    `;
    const result = await mysql.connect(sql, param);

    if (this.serviceUtil.isEmpty(result)) {
      throw new Error();
    }
    return result[0].affectedRows;
  }

  // update - 출석 체크
  public async updateMeetingAttendance(id: number, userId: string): Promise<number> {
    const param = [id, userId];

    const sql = `
    update 
      participatesMeeting
    set
      attendance = 0
    where 
      meetingId = ? and userId = ?
    `;
    const result = await mysql.connect(sql, param);

    if (this.serviceUtil.isEmpty(result)) {
      throw new DBException();
    }
    return result[0].affectedRows;
  }

  // select 현재 참가 신청 인원
  public async getCntMeetingParticipant(id: number): Promise<number> {
    const param = [id];

    const sql = `
    select
      count(*) as CntMeetingParticipant
    FROM
      participatesMeeting
    where
      meetingId = ? and status = 1
    limit 0, 1000;
    `;
    const result = await mysql.connect(sql, param);
    if (this.serviceUtil.isEmpty(result)) {
      throw new DBException();
    }
    return result[0][0].CntMeetingParticipant;
  }

  // select 리뷰 조건 검사
  public async isParticipant(id: number, userId: string): Promise<boolean> {
    const param = [id, userId];

    const sql = `
    select
      count(id) as cnt
    FROM
      participatesMeeting
    where
      meetingId = ? and userId = ? and status = 1
    limit 1;
    `;
    const result = await mysql.connect(sql, param);
    if (this.serviceUtil.isEmpty(result)) {
      throw new DBException();
    }
    return result[0][0].cnt === 1;
  }

  // select 리뷰 조건 검사
  public async isAttendee(id: number, userId: string): Promise<boolean> {
    const param = [id, userId];

    const sql = `
    select
      attendance
    FROM
      participatesMeeting
    where
      meetingId = ? and userId = ? and status = 1
    limit 0, 1000;
    `;
    const result = await mysql.connect(sql, param);
    if (this.serviceUtil.isEmpty(result)) {
      throw new DBException();
    }
    return result[0][0].attendance === 1;
  }
}
