import ServiceUtil from '../util/serviceUtil';
import { NullException } from '../util/customException';
import { Host } from '../model/resource/Host';
import hostRepository from '../repository/hostRepository';

export default class hostService {
  private serviceUtil: ServiceUtil;
  private hostRepository: hostRepository;
  // DI
  constructor(hostRepository: hostRepository, serviceUtil: ServiceUtil) {
    this.serviceUtil = serviceUtil;
    this.hostRepository = hostRepository;
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
    const resultHostInfo: Host = await this.hostRepository.getHost(id);
    return resultHostInfo;
  }

  public async getAllHost(hostIds: readonly string[]): Promise<Host[]> {
    const result = await this.hostRepository.getAllHost(hostIds);
    return result;
  }
}
