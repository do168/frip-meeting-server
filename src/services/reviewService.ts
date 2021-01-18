import { ReviewPostParam } from '../model/input/ReviewPostParam';
import { Review } from '../model/Review';
import reviewRepository from '../repository/reviewRepository';
import ServiceUtil from '../util/serviceUtil';
import { NullException, NotExistsException, ReviewConditionException } from '../util/customException';
import meetingRepository from '../repository/meetingRepository';
import { PostReturn } from '../model/PostReturn';
import { Page } from '../model/Page';

export default class reviewService {
  private reviewMapper: reviewRepository;
  private serviceUtil: ServiceUtil;
  // DI
  constructor(reviewMapper: reviewRepository, serviceUtil: ServiceUtil) {
    this.reviewMapper = reviewMapper;
    this.serviceUtil = serviceUtil;
  }

  /**
   * 리뷰 생성 서비스
   * @param param Review [meetingId, userId, title, content]
   * @return [ afftectedRow, insertId ]
   */
  public async createReview(condition: boolean, reviewInfo: ReviewPostParam): Promise<PostReturn> {
    // reviewInfo 빈값 체크
    this.serviceUtil.checkEmptyPostParam(reviewInfo, Object.keys(reviewInfo));
    if (!condition) {
      throw new ReviewConditionException();
    }
    const result = await this.reviewMapper.createReview(reviewInfo);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result.affectedRows != 1) {
      throw new NotExistsException();
    } else {
      return result;
    }
  }

  /**
   * 특정 리뷰 상세 데이터를 얻기 위한 함수
   * @param id 리뷰id
   * @return Review
   * @thorws Exception
   */
  public async getReview(id: number): Promise<Review> {
    // id 빈 값 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }
    const result = await this.reviewMapper.getReview(id);
    return result;
  }

  /**
   * 리뷰 리스트 조회 서비스. 모임, 유저별 필터를 통해 리스트를 조회할 수 있다
   * @param meetingId 필터링할 모임 ID
   * @param userId 필터링할 유저 ID
   * @param pageNum 페이지 번호
   * @return Array<Review>
   */
  public async listReviews(meetingId: number, userId: string, page: Page): Promise<Array<Review>> {
    // page 빈 값 체크
    this.serviceUtil.checkEmptyPostParam(page, Object.keys(page));
    // user 필터 리뷰 리스트
    if (this.serviceUtil.isEmpty(meetingId) && !this.serviceUtil.isEmpty(userId)) {
      const result = await this.reviewMapper.listUserReviews(userId, page);
      return result;
    }
    // meeting 필터 리뷰 리스트
    else if (!this.serviceUtil.isEmpty(meetingId) && this.serviceUtil.isEmpty(userId)) {
      const result = await this.reviewMapper.listMeetingReviews(meetingId, page);
      return result;
    }
    // 전체 리뷰 리스트
    else {
      const result = await this.reviewMapper.listReviews(page);
      return result;
    }
  }

  /**
   * 리뷰 삭제 서비스
   * @param id 삭제할 리뷰 ID
   * @reutrn affectedRow
   */
  public async deleteReview(id: number): Promise<Number> {
    // id 빈값 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }
    const result = await this.reviewMapper.deleteReview(id);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result != 1) {
      throw new NotExistsException();
    } else {
      return result;
    }
  }

  /**
   *
   * @param id 수정할 리뷰 ID
   * @param body 수정할 내용 - Review
   * @return affectedRow
   */
  public async updateReview(id: number, reviewInfo: ReviewPostParam): Promise<Number> {
    // id 빈 값 체크
    if (this.serviceUtil.isEmpty(id)) {
      throw new NullException('id');
    }
    // reviewInfo 빈 값 체크
    this.serviceUtil.checkEmptyPostParam(reviewInfo, Object.keys(reviewInfo));

    const result = await this.reviewMapper.updateReview(id, reviewInfo);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result != 1) {
      throw new NotExistsException();
    } else {
      return result;
    }
  }
}
