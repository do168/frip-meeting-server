import ServiceUtil from '../util/serviceUtil';
import {
  NullException,
  NotExistsException,
  TimeLimitException,
  FullParticipationException,
  NotCreationException,
} from '../util/customException';
import { User } from '../model/resource/User';
import userRepository from '../repository/userRepository';

export default class userService {
  private serviceUtil: ServiceUtil;
  private userRepository: userRepository;
  // DI
  constructor(userRepository: userRepository, serviceUtil: ServiceUtil) {
    this.serviceUtil = serviceUtil;
    this.userRepository = userRepository;
  }

  /**
   * user 정보를 가져오는 서비스
   * @param id 유저 id
   */
  public async getUser(id: string): Promise<User> {
    // id 빈 값 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }
    const resultUserInfo: User = await this.userRepository.getUser(id);

    return resultUserInfo;
  }

  public async listAllUsers(meetingIds: readonly number[]): Promise<User[]> {
    const resultUsers: User[] = await this.userRepository.listAllUsers(meetingIds);
    return resultUsers;
  }
}
