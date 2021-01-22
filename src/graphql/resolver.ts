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
import { Host } from '../model/Host';
import { User } from '../model/User';
import { Connection } from '../model/Connection';
import hostRepository from '../repository/hostRepository';
import hostService from '../services/hostService';
import userRepository from '../repository/userRepository';
import userService from '../services/userService';

const serviceUtilInstance = new ServiceUtil();
const meetingRepositoryInstance = new meetingRepository(serviceUtilInstance);
const reviewRepositoryInstance = new reviewRepository(serviceUtilInstance);
const hostRepositoryInstance = new hostRepository(serviceUtilInstance);
const userRepositoryInstance = new userRepository(serviceUtilInstance);
const meetingServiceInstance = new meetingService(meetingRepositoryInstance, serviceUtilInstance);
const reviewServiceInstance = new reviewService(reviewRepositoryInstance, serviceUtilInstance);
const hostServiceInstance = new hostService(hostRepositoryInstance, serviceUtilInstance);
const userServiceInstance = new userService(userRepositoryInstance, serviceUtilInstance);

// 모임에 작성된 리뷰 리스트 dataloader
const meetingConnectedReviewLoader = new DataLoader(async (meetingIds: readonly number[]) => {
  const result = await reviewServiceInstance.listAllReviews(meetingIds, []);
  return meetingIds.map((id) => result.filter((c) => c.meetingId === id));
});

// 유저 작성한 리뷰 리스트 dataloader
const userPostReviewLoader = new DataLoader(async (userIds: readonly string[]) => {
  const result = await reviewServiceInstance.listAllReviews([], userIds);
  return userIds.map((id) => result.filter((c) => c.userId === id));
});

const hostLoader = new DataLoader(async (hostIds: readonly string[]) => {
  const result = await hostServiceInstance.getAllHost(hostIds.map((i) => i));
  return hostIds.map((id) => result.filter((c) => c.id === id))[0];
});

const resolvers = {
  Query: {
    meeting: async (_: unknown, args: any): Promise<Meeting> => {
      const id = args.id ? Number(args.id) : 0;
      const result = await meetingServiceInstance.getMeeting(id);
      return result;
    },

    // Connection 객체로 페이징하여 리턴하기 -> 이게 맞나 싶습니다.
    meetings: async (_: unknown, args: any): Promise<Connection<Meeting>> => {
      const hostId = args.hostId ? String(args.hostId) : '';
      const page: Page = { pageNum: args.page.pageNum || 0, pageSize: args.page.pageSize + 1 || 0 };
      const result = await meetingServiceInstance.listMeetings(hostId, page);
      const totalcount = result.length - 1;
      const hasNextPage = result.length > args.page.pageSize;
      const nodes = hasNextPage ? result.slice(0, -1) : result;

      const edges = nodes.map((node) => {
        return {
          node: node,
          cursor: node.updatedAt,
        };
      });

      return {
        totalCount: totalcount,
        pageInfo: {
          hasNextPage: hasNextPage,
          endCursor: nodes[nodes.length - 1].updatedAt,
        },
        edges: edges || [],
      };
    },

    review: async (_: unknown, args: any): Promise<Review> => {
      const id = args.id ? Number(args.id) : 0;
      const result = await reviewServiceInstance.getReview(id);
      return result;
    },

    reviews: async (_: unknown, args: any): Promise<Connection<Review>> => {
      const meetingId = args.meetingId ? Number(args.meetingId) : 0;
      const userId = args.userId ? String(args.userId) : '';
      const page: Page = {
        pageNum: args.page.pageNum || 0,
        pageSize: args.page.pageSize + 1 || 0,
      };
      const result = await reviewServiceInstance.listReviews(meetingId, userId, page);
      const totalcount = result.length - 1;
      const hasNextPage = result.length > args.page.pageSize;
      const nodes = hasNextPage ? result.slice(0, -1) : result;

      const edges = nodes.map((node) => {
        return {
          node: node,
          cursor: node.updatedAt,
        };
      });

      return {
        totalCount: totalcount,
        pageInfo: {
          hasNextPage: hasNextPage,
          endCursor: nodes[nodes.length - 1].updatedAt,
        },
        edges: edges || [],
      };
    },
  },

  Meeting: {
    id: (parent: Meeting): number => {
      return parent.id || 0;
    },

    host: async (parent: Meeting): Promise<Host> => {
      const result = await hostLoader.load(parent.hostId);
      return result;
    },

    title: (parent: Meeting): string => {
      return parent.title;
    },

    content: (parent: Meeting): string => {
      return parent.content;
    },

    startAt: (parent: Meeting): string => {
      return parent.startAt;
    },

    endAt: (parent: Meeting): string => {
      return parent.endAt;
    },

    deadline: (parent: Meeting): string => {
      return parent.deadline;
    },

    maxParticipant: (parent: Meeting): number => {
      return parent.maxParticipant;
    },

    place: (parent: Meeting): string => {
      return parent.place;
    },

    updatedAt: (parent: Meeting): string => {
      return parent.updatedAt;
    },

    // participatesUsers: async (parent: Meeting): Promise<Connection<Participation>> => {
    //   const result = await meetingServiceInstance.listParticipationUsers(parent.id);
    //   return result;
    // },

    reviews: async (parent: Meeting): Promise<Review[]> => {
      const result = await meetingConnectedReviewLoader.load(parent.id);
      return result;
    },
  },

  Review: {
    id: (parent: Review): number => {
      return parent.id || 0;
    },

    title: (parent: Review): string => {
      return parent.title;
    },

    content: (parent: Review): string => {
      return parent.content;
    },

    updatedAt: (parent: Review): string => {
      return parent.updatedAt;
    },

    postedBy: async (parent: Review): Promise<User> => {
      const result = await userServiceInstance.getUser(parent.userId);
      return result;
    },
  },

  User: {
    id: (parent: User): string => {
      return parent.id;
    },

    nickname: (parent: User): string => {
      return parent.nickname;
    },

    // participatesMeetings: async (parent: User): Promise<Participation[]> => {
    //   const result = await meetingServiceInstance.listMeetings(parent.id);
    //   return result;
    // },

    postedReviews: async (parent: User): Promise<Review[]> => {
      const result = await userPostReviewLoader.load(parent.id);
      return result;
    },
  },

  Host: {
    id: (parent: Host): string => {
      return parent.id;
    },

    nickname: (parent: Host): string => {
      return parent.nickname;
    },

    // postedMeetings: async (parent: Host): Promise<Meeting[]> => {
    //   const result = await meetingServiceInstance.listMeetings(parent.id, page);
    //   return result;
    // },
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

    updateMeeting: async (_: unknown, args: any, { input }: { input: MeetingPostParam }): Promise<number> => {
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

    deleteMeeting: async (_: unknown, args: any): Promise<number> => {
      const id = args.id ? Number(args.id) : 0;
      const result = meetingServiceInstance.deleteMeeting(id);
      return result;
    },

    createMeetingParticipation: async (_: unknown, args: any): Promise<number> => {
      const meetingId = args.meetingId ? Number(args.meetingId) : 0;
      const userId = args.userId ? String(args.userId) : '';
      const result = await meetingServiceInstance.createMeetingParticipation(meetingId, userId);
      return result;
    },

    deleteMeetingParticipation: async (_: unknown, args: any): Promise<number> => {
      const meetingId = args.meetingId ? Number(args.meetingId) : 0;
      const userId = args.userId ? String(args.userId) : '';
      const result = await meetingServiceInstance.deleteMeetingParticipation(meetingId, userId);
      return result;
    },

    updateAttendance: async (_: unknown, args: any): Promise<number> => {
      const meetingId = args.meetingId ? Number(args.meetingId) : 0;
      const userId = args.userId ? String(args.userId) : '';
      const result = await meetingServiceInstance.updateMeetingAttendance(meetingId, userId);
      return result;
    },

    createReview: async (_: unknown, { input }: { input: ReviewPostParam }): Promise<number> => {
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

    updateReview: async (_: unknown, args: any, { input }: { input: ReviewPostParam }): Promise<number> => {
      const reviewPostParam: ReviewPostParam = {
        meetingId: input.meetingId || 0,
        userId: input.userId || '',
        title: input.title || '',
        content: input.content || '',
      };
      const id = args.id ? Number(args.id) : 0;
      const reuslt = await reviewServiceInstance.updateReview(id, reviewPostParam);
      return reuslt;
    },

    deleteReview: async (_: unknown, args: any): Promise<number> => {
      const id = args.id ? Number(args.id) : 0;
      const result = await reviewServiceInstance.deleteReview(id);
      return result;
    },
  },
};

export default resolvers;
