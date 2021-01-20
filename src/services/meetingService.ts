import { MeetingPostParam } from '../model/input/MeetingPostParam';
import { Meeting } from '../model/Meeting';
import meetingRepository from '../repository/meetingRepository';
import ServiceUtil from '../util/serviceUtil';
import {
  NullException,
  NotExistsException,
  TimeLimitException,
  FullParticipationException,
  NotCreationException,
} from '../util/customException';
import { PostReturn } from '../model/PostReturn';
import { ReviewPostParam } from '../model/input/ReviewPostParam';
import { Page } from '../model/Page';

export default class meetingService {
  private meetingRepository: meetingRepository;
  private serviceUtil: ServiceUtil;

  // DI
  constructor(meetingRepository: meetingRepository, serviceUtil: ServiceUtil) {
    this.meetingRepository = meetingRepository;
    this.serviceUtil = serviceUtil;
  }

  /**
   *
   * @param param 미팅 파라미터 [제목, 내용, 시작시간, 종료시간, 마감시간, 참가최대인원, 장소]
   * @return [ affectedRow, insertId ]
   */
  public async createMeeting(meetingInfo: MeetingPostParam): Promise<PostReturn> {
    // meetingInfo 빈 값 체크
    this.serviceUtil.checkEmptyPostParam(meetingInfo, Object.keys(meetingInfo));

    // meetingInfo 날짜 형식 체크
    this.serviceUtil.checkCorrectDateFormat(meetingInfo.startAt);
    this.serviceUtil.checkCorrectDateFormat(meetingInfo.endAt);
    this.serviceUtil.checkCorrectDateFormat(meetingInfo.deadline);

    const result = await this.meetingRepository.createMeeting(meetingInfo);

    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result.affectedRows != 1) {
      console.log(result.affectedRows);
      throw new NotCreationException();
    }
    return result;
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
    const resultMeetingInfo: Meeting = await this.meetingRepository.getMeeting(id);
    resultMeetingInfo.deadline = this.serviceUtil.dateToStr(new Date(resultMeetingInfo.deadline));
    resultMeetingInfo.startAt = this.serviceUtil.dateToStr(new Date(resultMeetingInfo.startAt));
    resultMeetingInfo.endAt = this.serviceUtil.dateToStr(new Date(resultMeetingInfo.endAt));
    resultMeetingInfo.updatedAt = this.serviceUtil.dateToStr(new Date(resultMeetingInfo.updatedAt));

    return resultMeetingInfo;
  }

  /**
   * 모임 조회 서비스 - 호스트 ID의 유무에 따라 필터로 검색한다
   * @param hostId 호스트 ID
   * @param pageNum 페이지 번호
   * @return Array<Meeting>
   */
  public async listMeetings(hostId: string, page: Page): Promise<Meeting[]> {
    // 빈값 체크
    this.serviceUtil.checkEmptyPostParam(page, Object.keys(page));

    // hostId가 값이 없는 경우 전체 모임을 조회한다
    if (this.serviceUtil.isEmpty(hostId)) {
      const result = await this.meetingRepository.listMeetings(page);
      for (const i in result) {
        result[i].deadline = this.serviceUtil.dateToStr(new Date(result[i].deadline));
      }
      return result;
    }
    // hostId가 값이 있는 경우 해당 호스트의 모임을 조회한다.
    else {
      const result = await this.meetingRepository.listHostMeetings(hostId, page);
      for (const i in result) {
        result[i].deadline = this.serviceUtil.dateToStr(new Date(result[i].deadline));
      }
      return result;
    }
  }

  /**
   * 미팅 삭제 서비스
   * @param id 삭제할 미팅 ID
   * @return affectedRow
   */
  public async deleteMeeting(id: number): Promise<number> {
    // id 빈 값 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }
    const result = await this.meetingRepository.deleteMeeting(id);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result != 1) {
      throw new NotExistsException();
    }
    return result;
  }

  /**
   * 모임 수정 서비스
   * @param id 모임 ID
   * @param meetingInfo 변경할 모임 정보
   * @return affectedRow
   */
  public async updateMeeting(id: number, meetingInfo: MeetingPostParam): Promise<number> {
    // id값 null 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }

    // meetinginfo 속성 null 체크
    this.serviceUtil.checkEmptyPostParam(meetingInfo, Object.keys(meetingInfo));

    const result = await this.meetingRepository.updateMeeting(id, meetingInfo);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result != 1) {
      throw new NotExistsException();
    }
    return result;
  }

  /**
   * 모임 참가 신청 서비스
   * @param id 참가할 모임 ID
   * @param userId 참가하는 유저 ID
   * @return [ affectedRow, insertId ]
   */
  public async createMeetingParticipation(id: number, userId: string): Promise<PostReturn> {
    // id 빈 값 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }
    // userId 빈 값 체크
    if (this.serviceUtil.isEmpty(userId)) {
      throw new NullException('userId');
    }

    // 참가인원 수가 최대 참가 가능 인원 수보다 작아야 하고, deadline보다 전에만 신청할 수 있다.
    const resultMeetingInfo = await this.meetingRepository.getMeeting(id);
    if (!this.serviceUtil.isBeforeTime(Number(new Date()), Number(resultMeetingInfo.deadline), 0)) {
      throw new TimeLimitException('마감 시간이 지났습니다');
    }

    // 참가인원 수가 최대 참가 가능 인원 수보다 적어야 한다.
    const cntCurrentParticipant = await this.meetingRepository.getCntMeetingParticipant(id);
    if (cntCurrentParticipant >= Number(resultMeetingInfo.maxParticipant)) {
      throw new FullParticipationException();
    }
    const result = await this.meetingRepository.createMeetingParticipation(id, userId);

    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result.affectedRows != 1) {
      throw new NotCreationException();
    }
    return result;
  }

  /**
   * 참가신청 취소 서비스
   * @param participationId 신청 취소할 참가 ID
   * @param userId 참가신청 취소할 유저 ID
   * @return affectedRow
   */
  public async deleteMeetingParticipation(id: number, userId: string): Promise<number> {
    // id 빈값 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }

    // userId 빈 값 체크
    if (this.serviceUtil.isEmpty(userId)) {
      throw new NullException('userId');
    }

    // deadline 전에만 취소를 할 수 있다!
    const resultMeetingInfo = await this.meetingRepository.getMeeting(id);
    if (!this.serviceUtil.isBeforeTime(Number(new Date()), Number(resultMeetingInfo.deadline), 0)) {
      throw new TimeLimitException('마감 시간이 지났습니다');
    }

    const result = await this.meetingRepository.deleteMeetingParticipation(id, userId);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result != 1) {
      throw new NotExistsException();
    }
    return result;
  }

  /**
   * 모임 출석 체크 서비스 - 모임 startAt 30분 후부터 가능하다.
   * @param id 모임 ID
   * @param userId 유저 ID
   * @return affectedRow
   */
  public async updateMeetingAttendance(id: number, userId: string): Promise<number> {
    // 파라미터 빈칸 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }

    if (this.serviceUtil.isEmpty(userId)) {
      throw new NullException('userId');
    }

    // 모임 시작 30분 후 조건 체크
    const resultMeetingInfo = await this.meetingRepository.getMeeting(id);
    if (!this.serviceUtil.isAfterTime(Number(resultMeetingInfo['startAt']), Number(new Date()), 30)) {
      throw new TimeLimitException('정해진 시간 후부터 체크가 가능합니다');
    }

    const result = await this.meetingRepository.updateMeetingAttendance(id, userId);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result != 1) {
      throw new NotExistsException();
    }
    return result;
  }

  public async checkReviewCondition(reviewInfo: ReviewPostParam): Promise<boolean> {
    // 리뷰 조건 검사 1. 미팅 참가 신청한 유저인지 판별한다.
    const isMeetingParticipant = await this.meetingRepository.isParticipant(reviewInfo.meetingId, reviewInfo.userId);
    if (!isMeetingParticipant) {
      return false;
    }
    // 리뷰 조건 검사 2. attendance 값을 이용해 판별한다.
    const isMeetingAttendance = await this.meetingRepository.isAttendee(reviewInfo.meetingId, reviewInfo.userId);
    if (!isMeetingAttendance) {
      return false;
    }
    return true;
  }
}
