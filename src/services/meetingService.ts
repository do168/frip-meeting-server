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

  public async getMeeting(id: number): Promise<JSON> {
    try {
      return await this.meetingMapper.getMeeting(id);
    } catch (error) {
      throw error;
    }
  }

  public async getHostMeetings(hostId: number): Promise<JSON> {
    try {
      return await this.meetingMapper.getHostMeetings(hostId);
    } catch (error) {
      throw error;
    }
  }

  public async getAllMeetings(): Promise<JSON> {
    try {
      return await this.meetingMapper.getAllMeetings();
    } catch (error) {
      throw error;
    }
  }
}
