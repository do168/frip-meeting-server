import { MeetingPostParam } from '../model/input/MeetingPostParam';
import { Meeting } from '../model/Meeting';
import meetingMapper from '../mapper/meetingMapper';
import serviceUtil from '../util/serviceUtil';
import {
  NullException,
  NotExistsException,
  TimeLimitException,
  FullParticipationException,
} from '../util/customException';

// pageSize - 파라미터로 받을지 고민
// 전체 미팅 목록 페이지 크기
const PAGE = 10;
// 호스트별 미팅 목록 페이지 크기
const PAGE_HOST = 5;

export default class meetingService {
  meetingMapper: meetingMapper;
  serviceUtil: serviceUtil;

  // DI
  constructor(meetingMapper: meetingMapper, serviceUtil: serviceUtil) {
    this.meetingMapper = meetingMapper;
    this.serviceUtil = serviceUtil;
  }

  /**
   *
   * @param param 미팅 파라미터 [제목, 내용, 시작시간, 종료시간, 마감시간, 참가최대인원, 장소]
   * @return [ affectedRow, insertId ]
   */
  public async createMeeting(meetingInfo: MeetingPostParam): Promise<Array<Number>> {
    // meetingInfo 빈 값 체크
    this.serviceUtil.isEmptyPostParam(meetingInfo, Object.keys(meetingInfo));

    const result = await this.meetingMapper.createMeeting(meetingInfo);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result[0] != 1) {
      throw new NotExistsException();
    } else {
      console.log('성공!');
      return result;
    }
  }

  /**
   * 특정 모임 상세 데이터를 얻기 위한 함수
   * @param id 모임id
   * @return Meeting
   * @thorws Exception
   */
  public async getMeeting(id: number): Promise<Meeting> {
    // id 빈 값 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }
    const resultMeetingInfo: Meeting = await this.meetingMapper.getMeeting(id);

    return resultMeetingInfo;
  }

  /**
   * 모임 조회 서비스 - 호스트 ID의 유무에 따라 필터로 검색한다
   * @param hostId 호스트 ID
   * @param pageNum 페이지 번호
   * @return Array<Meeting>
   */
  public async listMeetings(hostId: string, pageNum: number): Promise<Array<Meeting>> {
    if (this.serviceUtil.isEmpty(pageNum)) {
      throw new NullException('pageNum');
    }
    // hostId가 값이 없는 경우 전체 모임을 조회한다
    if (this.serviceUtil.isEmpty(hostId)) {
      const result = await this.meetingMapper.listMeetings(pageNum, PAGE);
      return result;
    }
    // hostId가 값이 있는 경우 해당 호스트의 모임을 조회한다.
    else {
      const result = await this.meetingMapper.listHostMeetings(hostId, pageNum, PAGE_HOST);
      return result;
    }
  }

  /**
   * 미팅 삭제 서비스
   * @param id 삭제할 미팅 ID
   * @return affectedRow
   */
  public async deleteMeeting(id: number): Promise<Number> {
    // id 빈 값 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }
    const result = await this.meetingMapper.deleteMeeting(id);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result != 1) {
      throw new NotExistsException();
    } else {
      return result;
    }
  }

  /**
   * 모임 수정 서비스
   * @param id 모임 ID
   * @param meetingInfo 변경할 모임 정보
   * @return affectedRow
   */
  public async updateMeeting(id: number, meetingInfo: MeetingPostParam): Promise<Number> {
    // id값 null 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }

    // meetinginfo 속성 null 체크
    this.serviceUtil.isEmptyPostParam(meetingInfo, Object.keys(meetingInfo));

    const result = await this.meetingMapper.updateMeeting(id, meetingInfo);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result != 1) {
      throw new NotExistsException();
    } else {
      return result;
    }
  }

  /**
   * 모임 참가 신청 서비스
   * @param id 참가할 모임 ID
   * @param userId 참가하는 유저 ID
   * @return [ affectedRow, insertId ]
   */
  public async createMeetingParticipation(id: number, userId: string): Promise<Array<Number>> {
    // id 빈 값 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }

    // userId 빈 값 체크
    if (this.serviceUtil.isEmpty(userId)) {
      throw new NullException('userId');
    }
    // 참가인원 수가 최대 참가 가능 인원 수보다 작아야 하고, deadline보다 전에만 신청할 수 있다.
    const resultMeetingInfo = await this.meetingMapper.getMeeting(id);
    if (!this.serviceUtil.isBeforeTime(Number(new Date()), Number(resultMeetingInfo.deadline), 0)) {
      throw new TimeLimitException('마감 시간이 지났습니다');
    }

    // 참가인원 수가 최대 참가 가능 인원 수보다 적어야 한다.
    const cntCurrentParticipant = await this.meetingMapper.getCntMeetingParticipant(id);
    if (cntCurrentParticipant == Number(resultMeetingInfo.maxParticipant)) {
      throw new FullParticipationException();
    }

    const result = await this.meetingMapper.createMeetingParticipation(id, userId);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result[0] != 1) {
      throw new NotExistsException();
    } else {
      return result;
    }
  }

  /**
   * 참가신청 취소 서비스
   * @param participationId 신청 취소할 참가 ID
   * @param userId 참가신청 취소할 유저 ID
   * @return affectedRow
   */
  public async deleteMeetingParticipation(id: number, userId: string): Promise<Number> {
    // id 빈값 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }

    // userId 빈 값 체크
    if (this.serviceUtil.isEmpty(userId)) {
      throw new NullException('userId');
    }

    // deadline 전에만 취소를 할 수 있다!
    const resultMeetingInfo = await this.meetingMapper.getMeeting(id);
    if (!this.serviceUtil.isBeforeTime(Number(new Date()), Number(resultMeetingInfo.deadline), 0)) {
      throw new TimeLimitException('마감 시간이 지났습니다');
    }

    const result = await this.meetingMapper.deleteMeetingParticipation(id, userId);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result != 1) {
      throw new NotExistsException();
    } else {
      return result;
    }
  }

  /**
   * 모임 출석 체크 서비스 - 모임 startAt 30분 후부터 가능하다.
   * @param id 모임 ID
   * @param userId 유저 ID
   * @return affectedRow
   */
  public async updateMeetingAttendance(id: number, userId: string): Promise<Number> {
    // 파라미터 빈칸 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }

    if (this.serviceUtil.isEmpty(userId)) {
      throw new NullException('userId');
    }

    // 모임 시작 30분 후 조건 체크
    const resultMeetingInfo = await this.meetingMapper.getMeeting(id);
    if (!this.serviceUtil.isAfterTime(Number(resultMeetingInfo['startAt']), Number(new Date()), 30)) {
      throw new TimeLimitException('정해진 시간 후부터 체크가 가능합니다');
    }

    const result = await this.meetingMapper.updateMeetingAttendance(id, userId);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result != 1) {
      throw new NotExistsException();
    } else {
      return result;
    }
  }
}
