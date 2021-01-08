import { meetingDto } from '../model/meetingDto';
import meetingMapper from '../mapper/meetingMapper';

export default class meetingService {
  meetingMapper: meetingMapper;
  constructor(meetingMapper: meetingMapper) {
    this.meetingMapper = meetingMapper;
  }
  public async createMeeting(param: meetingDto): Promise<JSON> {
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

  public async listAllMeetings(): Promise<JSON> {
    try {
      return await this.meetingMapper.listAllMeetings();
    } catch (error) {
      throw error;
    }
  }
}
