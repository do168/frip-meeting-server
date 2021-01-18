import { Meeting } from '../model/Meeting';
import { Page } from '../model/Page';
import { Review } from '../model/Review';
import meetingRepository from '../repository/meetingRepository';
import reviewRepository from '../repository/reviewRepository';
import meetingService from '../services/meetingService';
import reviewService from '../services/reviewService';
import ServiceUtil from '../util/serviceUtil';

const serviceUtilInstance = new ServiceUtil();
const meetingRepositoryInstance = new meetingRepository(serviceUtilInstance);
const reviewRepositoryInstance = new reviewRepository(serviceUtilInstance);
const meetingServiceInstance = new meetingService(meetingRepositoryInstance, serviceUtilInstance);
const reviewServiceInstance = new reviewService(reviewRepositoryInstance, serviceUtilInstance);

const resolvers = {
  Query: {
    meeting: async (_: unknown, args: any): Promise<Meeting> => {
      const id = args.id ? Number(args.id) : 0;
      const result = await meetingServiceInstance.getMeeting(id);
      return result;
    },

    meetings: async (_: unknown, args: any): Promise<Array<Meeting>> => {
      const hostId = args.hostId ? String(args.hostId) : '';
      const page: Page = { pageNum: args.page.pageNum || 0, pageSize: args.page.pageSize || 0 };
      const result = meetingServiceInstance.listMeetings(hostId, page);
      return result;
    },

    review: async (_: unknown, args: any): Promise<Review> => {
      const id = args.id ? Number(args.id) : 0;
      const result = await reviewServiceInstance.getReview(id);
      return result;
    },

    reviews: async (_: unknown, args: any): Promise<Array<Review>> => {
      const meetingId = args.meetingId ? Number(args.meetingId) : 0;
      const userId = args.userId ? String(args.userId) : '';
      const page: Page = {
        pageNum: args.page.pageNum || 0,
        pageSize: args.page.pageSize || 0,
      };
      const result = await reviewServiceInstance.listReviews(meetingId, userId, page);
      return result;
    },
  },
};
