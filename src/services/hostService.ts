import ServiceUtil from '../util/serviceUtil';
import {
  NullException,
  NotExistsException,
  TimeLimitException,
  FullParticipationException,
  NotCreationException,
} from '../util/customException';
import { Host } from '../model/Host';

export default class meetingService {
  private serviceUtil: ServiceUtil;

  // DI
  constructor(serviceUtil: ServiceUtil) {
    this.serviceUtil = serviceUtil;
  }

  /**
   * host 정보를 가져오는 서비스
   * @param id 호스트 id
   */
  public async getHost(id: string): Promise<Host> {
    // id 빈 값 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }
    const resultHostInfo: Host = await this.hostgMapper.getHost(id);

    return resultHostInfo;
  }
}
