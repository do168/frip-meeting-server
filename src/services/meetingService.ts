import { meetingPostParam } from "../model/input/meetingPostParam";
import meetingMapper from "../mapper/meetingMapper";

export default class meetingService {
	meetingMapper: meetingMapper;

	constructor(meetingMapper: meetingMapper) {
		this.meetingMapper = meetingMapper;
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
	public async listHostMeetings(hostId: string): Promise<JSON> {
		try {
			return await this.meetingMapper.listHostMeetings(hostId);
		} catch (error) {
			throw error;
		}
	}

	public async listMeetings(): Promise<JSON> {
		try {
			return await this.meetingMapper.listMeetings();
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
}
