import { Mysql as mysql } from '../config/mysql';
import { MeetingPostParam } from '../model/input/MeetingPostParam';
import { Meeting } from '../model/Meeting';
import ServiceUtil from '../util/serviceUtil';
import { PostReturn } from '../model/PostReturn';
import { Page } from '../model/Page';

export default class meetingRepository {
  // DI
  private serviceUtil: ServiceUtil;
  constructor(serviceUtil: ServiceUtil) {
    this.serviceUtil = serviceUtil;
  }

  // insert
  public async createMeeting(meetingInfo: MeetingPostParam): Promise<PostReturn> {
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
      STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'),
      STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'),
      STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'),
      ?,
      ?
    )`;
    const result = await mysql.transaction(sql, param);
    if (this.serviceUtil.isEmpty(result)) {
      throw new Error();
    }
    const postReturnModel: PostReturn = {
      affectedRows: result[0].affectedRows || 0,
      insertId: result[0].insertId || 0,
    };
    return postReturnModel;
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
      updatedAt,
      (SELECT 
        count(*)
      FROM
        participatesMeeting
      WHERE meetingId = ?) as currentParticipant   
    FROM
      meeting
    WHERE
      id = ? and status = 1
    `;
    const result = await mysql.connect(sql, param);
    if (this.serviceUtil.isEmpty(result)) {
      throw new Error();
    }
    return result[0][0];
  }

  // select
  public async listHostMeetings(hostId: string, page: Page): Promise<Array<Meeting>> {
    const offset = this.serviceUtil.caculateOffset(page.pageNum, page.pageSize);
    const param = [hostId, offset, page.pageSize];
    const sql = `
    SELECT
      id, title, deadline
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
      id, title, deadline
    FROM
      meeting  
    WHERE
      status = 1
    LIMIT ?, ?
    `;
    const result = await mysql.connect(sql, param);
    if (this.serviceUtil.isEmpty(result)) {
      throw new Error();
    }
    return result[0];
  }

  // delete
  public async deleteMeeting(id: number): Promise<Number> {
    const param = [id];
    const sql = `
    update 
      meeting
    set 
      status = 0
    where 
      id = ?
    `;
    const result = await mysql.transaction(sql, param);
    if (this.serviceUtil.isEmpty(result)) {
      throw new Error();
    }
    return result[0].affectedRows;
  }

  // update
  public async updateMeeting(id: number, meetingInfo: MeetingPostParam): Promise<Number> {
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
    const result = await mysql.transaction(sql, param);

    if (this.serviceUtil.isEmpty(result)) {
      throw new Error();
    }
    console.log('업데이트 로그 : ', result[0]);
    return result[0].affectedRows;
  }

  // insert
  public async createMeetingParticipation(id: number, userId: string): Promise<PostReturn> {
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
    const result = await mysql.transaction(sql, param);

    if (this.serviceUtil.isEmpty(result)) {
      throw new Error();
    }
    const postReturnModel: PostReturn = {
      affectedRows: result[0].affectedRows || 0,
      insertId: result[0].insertId || 0,
    };
    return postReturnModel;
  }

  // delete
  public async deleteMeetingParticipation(id: number, userId: string): Promise<Number> {
    const param = [id, userId];
    const sql = `
    update 
      participatesMeeting
    set
      status = 0
    where 
      meetingId = ? and userId = ?
    `;
    const result = await mysql.transaction(sql, param);

    if (this.serviceUtil.isEmpty(result)) {
      throw new Error();
    }
    return result[0].affectedRows;
  }

  // update - 출석 체크
  public async updateMeetingAttendance(id: number, userId: string): Promise<Number> {
    const param = [id, userId];

    const sql = `
    update 
      participatesMeeting
    set
      attendance = 0
    where 
      meetingId = ? and userId = ?
    `;
    const result = await mysql.transaction(sql, param);

    if (this.serviceUtil.isEmpty(result)) {
      throw new Error();
    }
    return result[0].affectedRows;
  }

  // select 현재 참가 신청 인원
  public async getCntMeetingParticipant(id: number): Promise<Number> {
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
      throw new Error();
    }
    return result[0][0].CntMeetingParticipant;
  }

  // select 리뷰 조건 검사
  public async isParticipant(id: number, userId: string): Promise<Boolean> {
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
      throw new Error();
    }
    console.log('미팅에 참여한 사람인가요', result[0][0].cnt);
    return result[0][0].cnt === 1;
  }

  // select 리뷰 조건 검사
  public async isAttendee(id: number, userId: string): Promise<Boolean> {
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
      throw new Error();
    }
    return result[0][0].attendance === 1;
  }
}
