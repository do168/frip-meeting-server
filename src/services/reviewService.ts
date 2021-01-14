import { ReviewPostParam } from '../model/input/ReviewPostParam';
import reviewMapper from '../mapper/reviewMapper';
import serviceUtil from '../util/serviceUtil';
import { ReturnModel } from '../model/ReturnModel';

// pageSize - 파라미터로 받을지 고민
const PAGE = 10;
const PAGE_MEETING = 5;
const PAGE_USER = 5;

export default class reviewService {
  reviewMapper: reviewMapper;
  serviceUtil: serviceUtil;
  // DI
  constructor(reviewMapper: reviewMapper, serviceUtil: serviceUtil) {
    this.reviewMapper = reviewMapper;
    this.serviceUtil = serviceUtil;
  }

  /**
   * 리뷰 생성 서비스
   * @param param ReviewPostParam [meetingId, userId, title, content]
   * @return ReturnModel { status, message }
   */
  public async createReview(reviewInfo: ReviewPostParam): Promise<ReturnModel> {
    if (this.serviceUtil.isEmptyPostParam(reviewInfo, Object.keys(reviewInfo))) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter cannot be null');
    }
    const result = await this.reviewMapper.createReview(reviewInfo);
    if (result != 1) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter Error!');
    } else {
      return this.serviceUtil.returnMethod(201, '리뷰 생성 완료!');
    }
  }

  /**
   * 특정 리뷰 상세 데이터를 얻기 위한 함수
   * @param id 리뷰id
   * @return ReturnModel { status, message }
   * @thorws Exception
   */
  public async getReview(id: number): Promise<ReturnModel> {
    if (this.serviceUtil.isEmpty(id)) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter cannot be null');
    }
    const result = await this.reviewMapper.getReview(id);
    if (this.serviceUtil.isEmpty(result)) {
      return this.serviceUtil.returnMethod(200, '해당 모임은 존재하지 않습니다');
    } else {
      return this.serviceUtil.returnMethod(200, { '리뷰 정보': result });
    }
  }

  /**
   * 리뷰 리스트 조회 서비스. 모임, 유저별 필터를 통해 리스트를 조회할 수 있다
   * @param meetingId 필터링할 모임 ID
   * @param userId 필터링할 유저 ID
   * @param pageNum 페이지 번호
   */
  public async listReviews(meetingId: number, userId: string, pageNum: number): Promise<ReturnModel> {
    if (this.serviceUtil.isEmpty(pageNum)) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter cannot be null');
    }
    // user 필터 리뷰 리스트
    if (this.serviceUtil.isEmpty(meetingId) && !this.serviceUtil.isEmpty(userId)) {
      const result = await this.reviewMapper.listUserReviews(userId, pageNum, PAGE_USER);
      return this.serviceUtil.returnMethod(200, { '리뷰 리스트': result });
    }
    // meeting 필터 리뷰 리스트
    else if (!this.serviceUtil.isEmpty(meetingId) && this.serviceUtil.isEmpty(userId)) {
      const result = await this.reviewMapper.listMeetingReviews(meetingId, pageNum, PAGE_MEETING);
      return this.serviceUtil.returnMethod(200, { '특정 모임의 리뷰 리스트': result });
    }
    // 전체 리뷰 리스트
    else {
      const result = await this.reviewMapper.listReviews(pageNum, PAGE);
      return this.serviceUtil.returnMethod(200, { '특정 유저의 리뷰 리스트': result });
    }
  }

  /**
   * 리뷰 삭제 서비스
   * @param id 삭제할 리뷰 ID
   */
  public async deleteReview(id: number): Promise<ReturnModel> {
    if (this.serviceUtil.isEmpty(id)) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter cannot be null');
    }
    const result = await this.reviewMapper.deleteReview(id);
    if (result != 1) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter Error!');
    } else {
      return this.serviceUtil.returnMethod(201, '리뷰 삭제 완료!');
    }
  }

  /**
   *
   * @param id 수정할 리부 ID
   * @param body 수정할 내용 ReviewPostParam [meetingId, userId, title, content]
   */
  public async updateReview(id: number, reviewInfo: ReviewPostParam): Promise<ReturnModel> {
    if (this.serviceUtil.isEmpty(id) || this.serviceUtil.isEmptyPostParam(reviewInfo, Object.keys(reviewInfo))) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter cannot be null');
    }
    const result = await this.reviewMapper.updateReview(id, reviewInfo);
    if (result != 1) {
      return this.serviceUtil.returnMethod(400, 'Bad Request - Parameter Error!');
    } else {
      return this.serviceUtil.returnMethod(200, '리뷰 수정 완료!');
    }
  }
}
