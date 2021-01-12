import { reviewPostParam } from "../model/input/reviewPostParam";
import reviewMapper from "../mapper/reviewMapper";
import serviceUtil from "../util/serviceUtil";

const PAGE: number = 10;
const PAGE_MEETING: number = 5;
const PAGE_USER: number = 5;

export default class reviewService {
	reviewMapper: reviewMapper;
	serviceUtil: serviceUtil;

	constructor(reviewMapper: reviewMapper, serviceUtil: serviceUtil) {
		this.reviewMapper = reviewMapper;
		this.serviceUtil = serviceUtil;
	}

	/**
	 * 리뷰 생성 서비스
	 * @param param reviewPostParam [meetingId, userId, title, content]
	 */
	public async createReview(param: reviewPostParam): Promise<Boolean> {
		try {
			const result = await this.reviewMapper.createReview(param);
			if ( result < 1) {
				return false;
			}
			else {
				return true;
			}
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 특정 모임 상세 데이터를 얻기 위한 함수
	 * @param id 모임id
	 * @return reviewDto
	 * @thorws Exception
	 */
	public async getReview(id: number): Promise<JSON> {
		try {
			const result = await this.reviewMapper.getReview(id);
			return result;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 리뷰 리스트 조회 서비스. 모임, 유저별 필터를 통해 리스트를 조회할 수 있다 
	 * @param meetingId 필터링할 모임 ID
	 * @param userId 필터링할 유저 ID
	 * @param pageNum 페이지 번호
	 */
	public async listReviews(meetingId: number, userId: string, pageNum: number): Promise<JSON> {
		// user 필터 리뷰 리스트
		if (this.serviceUtil.isEmpty(meetingId) && !this.serviceUtil.isEmpty(userId)) {
			try {
				const offset = this.serviceUtil.caculateOffset(pageNum, PAGE_USER);
				return await this.reviewMapper.listUserReviews(userId);
			} catch (error) {
				throw error;
			}
		}
		// meeting 필터 리뷰 리스트
		else if(!this.serviceUtil.isEmpty(meetingId) && this.serviceUtil.isEmpty(userId)) {
			try {
				const offset = this.serviceUtil.caculateOffset(pageNum, PAGE_MEETING);
				return await this.reviewMapper.listMeetingReviews(meetingId);
			} catch (error) {
				throw error;
			}
		}
		// 전체 리뷰 리스트
		else {
			try {
				const offset = this.serviceUtil.caculateOffset(pageNum, PAGE);
				return await this.reviewMapper.listReviews();
			} catch (error) {
				throw error;
			}
		}
	}

	/**
	 * 리뷰 삭제 서비스
	 * @param id 삭제할 리뷰 ID
	 */
	public async deleteReview(id: number): Promise<Boolean> {
		try {
			const result = await this.reviewMapper.deleteReview(id);
			if ( result < 1) {
				return false;
			}
			else {
				return true;
			}
		} catch (error) {
			throw error;
		}
  }
	
	/**
	 * 
	 * @param id 수정할 리부 ID
	 * @param body 수정할 내용 reviewPostParam [meetingId, userId, title, content]
	 */
  public async updateReview(id: number, body: reviewPostParam): Promise<Boolean> {
    try {
			const result = await this.reviewMapper.updateReview(id, body);
			if ( result < 1) {
				return false;
			}
			else {
				return true;
			}
    } catch (error) {
      throw error;
    }
  }
}
