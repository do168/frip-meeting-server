import { meetingPostParam } from "../model/input/meetingPostParam";
import meetingMapper from "../mapper/meetingMapper";
import serviceUtil from "../util/serviceUtil";

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

	public async createMeeting(param: meetingPostParam): Promise<JSON> {
		try {
			return await this.meetingMapper.createMeeting(param);
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
	public async getMeeting(id: number): Promise<JSON> {
		try {
			const result = await this.meetingMapper.getMeeting(id);
			return result;
		} catch (error) {
			throw error;
		}
	}

	/**
	 *
	 * @param hostId
	 */
	public async listHostMeetings(hostId: string, pageNum: number): Promise<JSON> {
		try {
			const offset = this.serviceUtil.caculateOffset(pageNum, PAGE_HOST);
			return await this.meetingMapper.listHostMeetings(hostId, offset, PAGE_HOST);
		} catch (error) {
			throw error;
		}
	}

	public async listMeetings(pageNum: number): Promise<JSON> {
		try {
			const offset = this.serviceUtil.caculateOffset(pageNum, PAGE);
			return await this.meetingMapper.listMeetings(offset, PAGE);
		} catch (error) {
			throw error;
		}
	}

	public async deleteMeeting(id: number): Promise<JSON> {
		try {
			return await this.meetingMapper.deleteMeeting(id);
		} catch (error) {
			throw error;
		}
	}

	public async updateMeeting(id: number, body: meetingPostParam): Promise<JSON> {
		try {
			return await this.meetingMapper.updateMeeting(id, body);
		} catch (error) {
			throw error;
		}
	}

	public async createMeetingParticipation(id: number, userId: string): Promise<JSON> {
		try {
			return await this.meetingMapper.createMeetingParticipation(id, userId);
		} catch (error) {
			throw error;
		}
	}

	public async deleteMeetingParticipation(participationId: number, userId: string): Promise<JSON> {
		try {
			return await this.meetingMapper.deleteMeetingParticipation(participationId, userId);
		} catch (error) {
			throw error;
		}
	}
}
