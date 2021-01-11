import { reviewPostParam } from "../model/input/reviewPostParam";
import reviewMapper from "../mapper/reviewMapper";

export default class reviewService {
	reviewMapper: reviewMapper;

	constructor(reviewMapper: reviewMapper) {
		this.reviewMapper = reviewMapper;
	}

	public async createReview(param: reviewPostParam): Promise<JSON> {
		try {
			return await this.reviewMapper.createReview(param);
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
	 *
	 * @param meetingId
	 */
	public async listMeetingReviews(meetingId: number, pageNum: number): Promise<JSON> {
		try {
			return await this.reviewMapper.listMeetingReviews(meetingId);
		} catch (error) {
			throw error;
		}
	}

	public async listUserReviews(userId: string, pageNum: number): Promise<JSON> {
		try {
			return await this.reviewMapper.listUserReviews(userId);
		} catch (error) {
			throw error;
		}
	}

	public async deleteReview(id: number): Promise<JSON> {
		try {
			return await this.reviewMapper.deleteReview(id);
		} catch (error) {
			throw error;
		}
  }
  
  public async updateReview(id: number, body: reviewPostParam): Promise<JSON> {
    try {
      return await this.reviewMapper.updateReview(id, body);
    } catch (error) {
      throw error;
    }
  }
}
