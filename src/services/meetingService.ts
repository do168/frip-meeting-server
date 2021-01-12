import { meetingPostParam } from "../model/input/meetingPostParam";
import meetingMapper from "../mapper/meetingMapper";
import serviceUtil from "../util/serviceUtil";
import { meetingDto } from "../model/meetingDto";

// 전체 미팅 목록 페이지 크기
const PAGE = 10;
// 호스트별 미팅 목록 페이지 크기
const PAGE_HOST = 5;

export default class meetingService {
	meetingMapper: meetingMapper;
	serviceUtil: serviceUtil;

	constructor(meetingMapper: meetingMapper, serviceUtil: serviceUtil) {
		this.meetingMapper = meetingMapper;
		this.serviceUtil = serviceUtil;
	}

	/**
	 * 	
	 * @param param 미팅 파라미터 [제목, 내용, 시작시간, 종료시간, 마감시간, 참가최대인원, 장소]
	 * @return True if OK
	 *         else False
	 */
	public async createMeeting(param: meetingPostParam): Promise<Boolean> {
		try {
			const result = await this.meetingMapper.createMeeting(param);
			if (result < 1) {
				return false;
			} else {
				return true;
			}
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 특정 모임 상세 데이터를 얻기 위한 함수
	 * @param id 모임id
	 * @return MeetingDto
	 * @thorws Exception
	 */
	public async getMeeting(id: number): Promise<meetingDto> {
		try {
			const result = await this.meetingMapper.getMeeting(id);
			return result;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 모임 조회 서비스 - 호스트 ID의 유무에 따라 필터로 검색한다
	 * @param hostId 호스트 ID
	 * @param pageNum 페이지 번호
	 */
	public async listMeetings(hostId: string, pageNum: number): Promise<JSON> {
		// hostId가 값이 없는 경우 전체 모임을 조회한다
		if (this.serviceUtil.isEmpty(hostId)) {
			try {
				const offset = this.serviceUtil.caculateOffset(pageNum, PAGE);
				return await this.meetingMapper.listMeetings(offset, PAGE);
			} catch (error) {
				throw error;
			}
		}
		// hostId가 값이 있는 경우 해당 호스트의 모임을 조회한다.
		else {
			try {
				const offset = this.serviceUtil.caculateOffset(pageNum, PAGE_HOST);
				return await this.meetingMapper.listHostMeetings( hostId, offset, PAGE_HOST );
			} catch (error) {
				throw error;
			}
		}
	}

	/**
	 * 미팅 삭제 서비스
	 * @param id 삭제할 미팅 ID
	 */
	public async deleteMeeting(id: number): Promise<Boolean> {
		try {
			const result = await this.meetingMapper.deleteMeeting(id);
			if (result < 1) {
				return false;
			} else {
				return true;
			}
		} catch (error) {
			throw error;
		}
	}

	public async updateMeeting(id: number, body: meetingPostParam ): Promise<Boolean> {
		try {
			const result = await this.meetingMapper.updateMeeting(id, body);
			if (result < 1) {
				return false;
			} else {
				return true;
			}
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 모임 참가 신청 서비스
	 * @param id 참가할 모임 ID
	 * @param userId 참가하는 유저 ID
	 */
	public async createMeetingParticipation( id: number, userId: string ): Promise<Boolean> {
		try {
			const result = await this.meetingMapper.createMeetingParticipation(
				id,
				userId
			);
			if (result < 1) {
				return false;
			} else {
				return true;
			}
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 참가신청 취소 서비스
	 * @param participationId 신청 취소할 참가 ID
	 * @param userId 참가신청 취소할 유저 ID
	 */
	public async deleteMeetingParticipation( participationId: number, userId: string ): Promise<Boolean> {
		try {
			const result = await this.meetingMapper.deleteMeetingParticipation(
				participationId,
				userId
			);
			if (result < 1) {
				return false;
			} else {
				return true;
			}
		} catch (error) {
			throw error;
		}
	}
}
