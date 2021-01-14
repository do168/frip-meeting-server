import { ReviewPostParam } from '../model/input/ReviewPostParam';
import { Review } from '../model/Review';
import reviewMapper from '../mapper/reviewMapper';
import ServiceUtil from '../util/serviceUtil';
import { NullException, NotExistsException, ReviewConditionException } from '../util/customException';
import meetingMapper from '../mapper/meetingMapper';

// pageSize - 파라미터로 받을지 고민
const PAGE = 10;
const PAGE_MEETING = 5;
const PAGE_USER = 5;

export default class reviewService {
  meetingMapper: meetingMapper;
  reviewMapper: reviewMapper;
  serviceUtil: ServiceUtil;
  // DI
  constructor(meetingMapper: meetingMapper, reviewMapper: reviewMapper, serviceUtil: ServiceUtil) {
    this.meetingMapper = meetingMapper;
    this.reviewMapper = reviewMapper;
    this.serviceUtil = serviceUtil;
  }

  /**
   * 리뷰 생성 서비스
   * @param param Review [meetingId, userId, title, content]
   * @return [ afftectedRow, insertId ]
   */
  public async createReview(reviewInfo: ReviewPostParam): Promise<Array<Number>> {
    // reviewInfo 빈값 체크
    this.serviceUtil.isEmptyPostParam(reviewInfo, Object.keys(reviewInfo));

    // 리뷰 조건 검사. attendance 값을 이용해 판별한다.
    const reviewCondition = await this.meetingMapper.isAttendee(reviewInfo.meetingId, reviewInfo.userId);
    if (!reviewCondition) {
      throw new ReviewConditionException();
    }

    const result = await this.reviewMapper.createReview(reviewInfo);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result[0] != 1) {
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
  public async listReviews(meetingId: number, userId: string, pageNum: number): Promise<Array<Review>> {
    // pageNum 빈 값 체크
    if (this.serviceUtil.isEmpty(pageNum)) {
      throw new NullException('pageNum');
    }
    // user 필터 리뷰 리스트
    if (this.serviceUtil.isEmpty(meetingId) && !this.serviceUtil.isEmpty(userId)) {
      const result = await this.reviewMapper.listUserReviews(userId, pageNum, PAGE_USER);
      return result;
    }
    // meeting 필터 리뷰 리스트
    else if (!this.serviceUtil.isEmpty(meetingId) && this.serviceUtil.isEmpty(userId)) {
      const result = await this.reviewMapper.listMeetingReviews(meetingId, pageNum, PAGE_MEETING);
      return result;
    }
    // 전체 리뷰 리스트
    else {
      const result = await this.reviewMapper.listReviews(pageNum, PAGE);
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
    this.serviceUtil.isEmptyPostParam(reviewInfo, Object.keys(reviewInfo));

    const result = await this.reviewMapper.updateReview(id, reviewInfo);
    // affectedRow가 1이 아닌 경우 에러 리턴
    if (result != 1) {
      throw new NotExistsException();
    } else {
      return result;
    }
  }
}
