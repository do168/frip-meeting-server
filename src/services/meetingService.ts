import { MeetingPostParam } from '../model/input/MeetingPostParam';
import meetingMapper from '../mapper/meetingMapper';
import serviceUtil from '../util/serviceUtil';
import { ReturnModel } from '../model/ReturnModel';

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
   * @return ReturnModel { status, message }
   */
  public async createMeeting(meetingInfo: MeetingPostParam): Promise<ReturnModel> {
    if (this.serviceUtil.isEmptyPostParam(meetingInfo, Object.keys(meetingInfo))) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter cannot be null');
    }
    const result = await this.meetingMapper.createMeeting(meetingInfo);
    if (result != 1) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter Error!');
    } else {
      console.log('성공!');
      return this.serviceUtil.returnMethod(201, '모임 생성 완료!');
    }
  }

  /**
   * 특정 모임 상세 데이터를 얻기 위한 함수
   * @param id 모임id
   * @return ReturnModel { status, message }
   * @thorws Exception
   */
  public async getMeeting(id: number): Promise<ReturnModel> {
    if (this.serviceUtil.isEmpty(id)) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter cannot be null');
    }
    const resultMeetingInfo = await this.meetingMapper.getMeeting(id);
    const cntMeetingParticipation = await this.meetingMapper.getCntMeetingParticipant(id);
    if (this.serviceUtil.isEmpty(resultMeetingInfo)) {
      return this.serviceUtil.returnMethod(200, '해당 모임은 존재하지 않습니다');
    } else {
      return this.serviceUtil.returnMethod(200, {
        '모임 정보': resultMeetingInfo,
        '현재 신청 인원': cntMeetingParticipation,
      });
    }
  }

  /**
   * 모임 조회 서비스 - 호스트 ID의 유무에 따라 필터로 검색한다
   * @param hostId 호스트 ID
   * @param pageNum 페이지 번호
   * @return ReturnModel { status, message }
   */
  public async listMeetings(hostId: string, pageNum: number): Promise<ReturnModel> {
    // hostId가 값이 없는 경우 전체 모임을 조회한다
    if (this.serviceUtil.isEmpty(hostId)) {
      const result = await this.meetingMapper.listMeetings(pageNum, PAGE);
      if (this.serviceUtil.isEmpty(result)) {
        return this.serviceUtil.returnMethod(200, '모임이 존재하지 않습니다');
      } else {
        return this.serviceUtil.returnMethod(200, { '모임 리스트': result });
      }
    }
    // hostId가 값이 있는 경우 해당 호스트의 모임을 조회한다.
    else {
      const result = await this.meetingMapper.listHostMeetings(hostId, pageNum, PAGE_HOST);
      if (this.serviceUtil.isEmpty(result)) {
        return this.serviceUtil.returnMethod(200, '해당 호스트가 만든 모임이 존재하지 않습니다');
      } else {
        return this.serviceUtil.returnMethod(200, {
          '호스트 모임 리스트': result,
        });
      }
    }
  }

  /**
   * 미팅 삭제 서비스
   * @param id 삭제할 미팅 ID
   * @return ReturnModel { status, message }
   */
  public async deleteMeeting(id: number): Promise<ReturnModel> {
    if (this.serviceUtil.isEmpty(id)) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter cannot be null');
    }
    const result = await this.meetingMapper.deleteMeeting(id);
    if (result != 1) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter Error!');
    } else {
      return this.serviceUtil.returnMethod(200, '모임 삭제 완료!');
    }
  }

  public async updateMeeting(id: number, meetingInfo: MeetingPostParam): Promise<ReturnModel> {
    if (this.serviceUtil.isEmpty(id) || this.serviceUtil.isEmptyPostParam(meetingInfo, Object.keys(meetingInfo))) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter cannot be null');
    }
    const result = await this.meetingMapper.updateMeeting(id, meetingInfo);
    if (result != 1) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter Error!');
    } else {
      return this.serviceUtil.returnMethod(200, '모임 수정 완료!');
    }
  }

  /**
   * 모임 참가 신청 서비스
   * @param id 참가할 모임 ID
   * @param userId 참가하는 유저 ID
   * @return ReturnModel { status, message }
   */
  public async createMeetingParticipation(id: number, userId: string): Promise<ReturnModel> {
    if (this.serviceUtil.isEmpty(id) || this.serviceUtil.isEmpty(userId)) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter cannot be null');
    }

    const result = await this.meetingMapper.createMeetingParticipation(id, userId);
    if (result != 1) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter Error!');
    } else {
      return this.serviceUtil.returnMethod(201, '참가 신청 완료!');
    }
  }

  /**
   * 참가신청 취소 서비스
   * @param participationId 신청 취소할 참가 ID
   * @param userId 참가신청 취소할 유저 ID
   * @return ReturnModel { status, message }
   */
  public async deleteMeetingParticipation(participationId: number, userId: string): Promise<ReturnModel> {
    if (this.serviceUtil.isEmpty(participationId) || this.serviceUtil.isEmpty(userId)) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter cannot be null');
    }
    const result = await this.meetingMapper.deleteMeetingParticipation(participationId, userId);
    if (result < 1) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter Error!');
    } else {
      return this.serviceUtil.returnMethod(200, '신청 취소 완료!');
    }
  }
}
