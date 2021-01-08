import mybatisMapper from 'mybatis-mapper';
import { Mysql as mysql } from '../config/mysql';
import { meetingPostParam } from '../model/input/meetingPostParam';
import { meetingDto } from '../model/meetingDto';

export default class meetingMapper {
  constructor() {
    mybatisMapper.createMapper(['resource/mapper/meetingMapper.xml']);
  }
  public async createMeeting(params: meetingPostParam): Promise<JSON> {
    try {
      const param = {title: params.title, 
        content: params.content,
        startAt: params.startAt,
        endAt: params.endAt,
        deadline: params.deadline,
        maxParticipant: params.maxParticipant,
        place: params.place }
      const query = mybatisMapper.getStatement('meetingMapper', 'createMeeting', param);
      const post = await mysql.transaction((con: any) => con.query(query))();
      return post[0];
    } catch (error) {
      throw error;
    }
  }

  public async getMeeting(id: number): Promise<JSON> {
    try {
      const param = { id: id };
      const query = mybatisMapper.getStatement('meetingMapper', 'getMeeting', param);
      const get = await mysql.connect((con: any) => con.query(query))();
      return get[0];
    } catch (error) {
      throw error;
    }
  }

  public async listHostMeetings(hostId: string): Promise<JSON> {
    try {
      const param = { hostId: hostId };
      const query = mybatisMapper.getStatement('meetingMapper', 'getHostMeetings', param);
      const get = await mysql.connect((con: any) => con.query(query))();
      return get[0];
    } catch (error) {
      throw error;
    }
  }

  public async listAllMeetings(): Promise<JSON> {
    try {
      const query = mybatisMapper.getStatement('meetingMapper', 'getAllMeetings');
      const get = await mysql.connect((con: any) => con.query(query))();
      return get[0];
    } catch (error) {
      throw error;
    }
  }
}
