import { MeetingPostParam } from '../model/input/MeetingPostParam';
import { ReviewPostParam } from '../model/input/ReviewPostParam';
import { Meeting } from '../model/Meeting';
import { Page } from '../model/Page';
import { Review } from '../model/Review';
import meetingRepository from '../repository/meetingRepository';
import reviewRepository from '../repository/reviewRepository';
import meetingService from '../services/meetingService';
import reviewService from '../services/reviewService';
import ServiceUtil from '../util/serviceUtil';
import DataLoader from 'dataloader';

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

  Mutation: {
    createMeeting: async (_: unknown, { input }: { input: MeetingPostParam }) => {
      const meetingPostParam: MeetingPostParam = {
        hostId: input.hostId || '',
        title: input.title || '',
        content: input.title || '',
        startAt: input.startAt || '',
        endAt: input.endAt || '',
        deadline: input.deadline || '',
        maxParticipant: input.maxParticipant || 0,
        place: input.place || '',
      };
      const result = meetingServiceInstance.createMeeting(meetingPostParam);
      return result;
    },

    updateMeeting: async (_: unknown, args: any, { input }: { input: MeetingPostParam }) => {
      const meetingPostParam: MeetingPostParam = {
        hostId: input.hostId || '',
        title: input.title || '',
        content: input.title || '',
        startAt: input.startAt || '',
        endAt: input.endAt || '',
        deadline: input.deadline || '',
        maxParticipant: input.maxParticipant || 0,
        place: input.place || '',
      };
      const id = args.id ? Number(args.id) : 0;
      const result = meetingServiceInstance.updateMeeting(id, meetingPostParam);
      return result;
    },

    deleteMeeting: async (_: unknown, args: any) => {
      const id = args.id ? Number(args.id) : 0;
      const result = meetingServiceInstance.deleteMeeting(id);
      return result;
    },

    createMeetingParticipation: async (_: unknown, args: any) => {
      const meetingId = args.meetingId ? Number(args.meetingId) : 0;
      const userId = args.userId ? String(args.userId) : '';
      const result = await meetingServiceInstance.createMeetingParticipation(meetingId, userId);
      return result;
    },

    deleteMeetingParticipation: async (_: unknown, args: any) => {
      const meetingId = args.meetingId ? Number(args.meetingId) : 0;
      const userId = args.userId ? String(args.userId) : '';
      const result = await meetingServiceInstance.deleteMeetingParticipation(meetingId, userId);
      return result;
    },

    updateAttendance: async (_: unknown, args: any) => {
      const meetingId = args.meetingId ? Number(args.meetingId) : 0;
      const userId = args.userId ? String(args.userId) : '';
      const result = await meetingServiceInstance.updateMeetingAttendance(meetingId, userId);
      return result;
    },

    createReview: async (_: unknown, { input }: { input: ReviewPostParam }) => {
      const reviewPostParam: ReviewPostParam = {
        meetingId: input.meetingId || 0,
        userId: input.userId || '',
        title: input.title || '',
        content: input.content || '',
      };
      const condition = await meetingServiceInstance.checkReviewCondition(reviewPostParam);
      const reuslt = reviewServiceInstance.createReview(condition, reviewPostParam);
      return reuslt;
    },

    updateReview: async (_: unknown, args: any, { input }: { input: ReviewPostParam }) => {
      const reviewPostParam: ReviewPostParam = {
        meetingId: input.meetingId || 0,
        userId: input.userId || '',
        title: input.title || '',
        content: input.content || '',
      };
      const id = args.id ? Number(args.id) : 0;
      const reuslt = reviewServiceInstance.updateReview(id, reviewPostParam);
      return reuslt;
    },

    deleteReview: async (_: unknown, args: any) => {
      const id = args.id ? Number(args.id) : 0;
      const result = reviewServiceInstance.deleteReview(id);
      return result;
    },
  },
};

export default resolvers;
