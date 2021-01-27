import { MeetingPostParam } from '../model/input/MeetingPostParam';
import { ReviewPostParam } from '../model/input/ReviewPostParam';
import { Meeting } from '../model/resource/Meeting';
import { Page } from '../model/Connections/Page';
import { Review } from '../model/resource/Review';
import meetingRepository from '../repository/meetingRepository';
import reviewRepository from '../repository/reviewRepository';
import meetingService from '../services/meetingService';
import reviewService from '../services/reviewService';
import ServiceUtil from '../util/serviceUtil';
import DataLoader from 'dataloader';
import { Host } from '../model/resource/Host';
import { User } from '../model/resource/User';
import { Connection } from '../model/Connections/Connection';
import hostRepository from '../repository/hostRepository';
import hostService from '../services/hostService';
import userRepository from '../repository/userRepository';
import userService from '../services/userService';
import { Participation } from '../model/resource/Participation';
import { GraphQLScalarType, Kind } from 'graphql';
import { DeleteStatus } from '../model/enum/DeleteStatus';
import { PageValidate } from '../model/enum/PageValidate';

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

// 모임에 참여한 유저 리스트 dataloader
const meetingParticipatedUserLoader = new DataLoader(async (meetingIds: readonly number[]) => {
  const result = await userServiceInstance.listAllUsers(meetingIds);
  return meetingIds.map((id) => result.filter((c) => c.meetingId === id));
});

// 호스트 dataloader
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

    meetings: async (_: unknown, args: any): Promise<Connection<Meeting>> => {
      const hostId = args.hostId ? String(args.hostId) : '';
      const page = {
        pageNum: args.page.pageNum || PageValidate.INVALIDATE,
        pageSize: args.page.PageSize || PageValidate.INVALIDATE,
        first: args.page.first ? Number(args.page.first) + 1 : 1,
        after: args.page.after
          ? Number(serviceUtilInstance.convertId(args.page.after))
          : await meetingServiceInstance.getLastId(),
      };
      const result = await meetingServiceInstance.listMeetings(hostId, page);

      const totalcount = result.length == page.first ? page.first - 1 : result.length;
      const hasNextPage = result.length == page.first;
      const nodes = hasNextPage ? result.slice(0, -1) : result;

      const edges = nodes.map((node) => {
        return {
          node: node,
          cursor: serviceUtilInstance.convertCursor(node.id, 'Meeting'),
        };
      });

      return {
        totalCount: totalcount,
        pageInfo: {
          hasNextPage: hasNextPage,
          endCursor: serviceUtilInstance.convertCursor(nodes[nodes.length - 1].id, 'Meeting'),
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
      const page = {
        pageNum: args.page.pageNum || PageValidate.INVALIDATE,
        pageSize: args.page.PageSize || PageValidate.INVALIDATE,
        first: args.page.first ? Number(args.page.first) + 1 : 1,
        after: args.page.after
          ? Number(serviceUtilInstance.convertId(args.page.after))
          : await reviewServiceInstance.getLastId(),
      };
      const result = await reviewServiceInstance.listReviews(meetingId, userId, page);

      const totalcount = result.length == page.first ? page.first - 1 : result.length;
      const hasNextPage = result.length == page.first;
      const nodes = hasNextPage ? result.slice(0, -1) : result;

      const edges = nodes.map((node) => {
        return {
          node: node,
          cursor: serviceUtilInstance.convertCursor(node.id, 'Review'),
        };
      });

      return {
        totalCount: totalcount,
        pageInfo: {
          hasNextPage: hasNextPage,
          endCursor: serviceUtilInstance.convertCursor(nodes[nodes.length - 1].id, 'Review'),
        },
        edges: edges || [],
      };
    },
  },

  Mutation: {
    createMeeting: async (_: unknown, { input }: { input: MeetingPostParam }): Promise<Meeting> => {
      const id = await meetingServiceInstance.createMeeting(input);
      const result = await meetingServiceInstance.getMeeting(id);
      return result;
    },

    updateMeeting: async (_: unknown, args: any): Promise<Meeting> => {
      const id = Number(args.id);
      await meetingServiceInstance.updateMeeting(id, args.input);
      const result = await meetingServiceInstance.getMeeting(id);
      return result;
    },

    deleteMeeting: async (_: unknown, args: any): Promise<DeleteStatus> => {
      const id = args.id ? Number(args.id) : 0;
      try {
        await meetingServiceInstance.deleteMeeting(id);
        return DeleteStatus.SUCCESS;
      } catch (error) {
        return DeleteStatus.FAIL;
      }
    },

    createMeetingParticipation: async (_: unknown, args: any): Promise<Participation> => {
      const meetingId = args.meetingId ? Number(args.meetingId) : 0;
      const userId = args.userId ? String(args.userId) : '';
      await meetingServiceInstance.createMeetingParticipation(meetingId, userId);
      return {
        meeting: await meetingServiceInstance.getMeeting(meetingId),
        user: await userServiceInstance.getUser(userId),
      };
    },

    deleteMeetingParticipation: async (_: unknown, args: any): Promise<DeleteStatus> => {
      const meetingId = args.meetingId ? Number(args.meetingId) : 0;
      const userId = args.userId ? String(args.userId) : '';
      try {
        await meetingServiceInstance.deleteMeetingParticipation(meetingId, userId);
        return DeleteStatus.SUCCESS;
      } catch (error) {
        return DeleteStatus.FAIL;
      }
    },

    updateAttendance: async (_: unknown, args: any): Promise<Participation> => {
      const meetingId = args.meetingId ? Number(args.meetingId) : 0;
      const userId = args.userId ? String(args.userId) : '';
      await meetingServiceInstance.updateMeetingAttendance(meetingId, userId);
      return {
        meeting: await meetingServiceInstance.getMeeting(meetingId),
        user: await userServiceInstance.getUser(userId),
      };
    },

    createReview: async (_: unknown, { input }: { input: ReviewPostParam }): Promise<Review> => {
      const condition = await meetingServiceInstance.checkReviewCondition(input);
      const id = await reviewServiceInstance.createReview(condition, input);
      const result = await reviewServiceInstance.getReview(id);
      return result;
    },

    updateReview: async (_: unknown, args: any): Promise<Review> => {
      const id = args.id ? Number(args.id) : 0;
      await reviewServiceInstance.updateReview(id, args.input);
      const result = await reviewServiceInstance.getReview(id);
      return result; // 리턴값을 어떻게 해야할까?
    },

    deleteReview: async (_: unknown, args: any): Promise<DeleteStatus> => {
      const id = args.id ? Number(args.id) : 0;
      try {
        await reviewServiceInstance.deleteReview(id);
        return DeleteStatus.SUCCESS;
      } catch (error) {
        return DeleteStatus.FAIL;
      }
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

    startAt: (parent: Meeting): Date => {
      return parent.startAt;
    },

    endAt: (parent: Meeting): Date => {
      return parent.endAt;
    },

    deadline: (parent: Meeting): Date => {
      return parent.deadline;
    },

    maxParticipant: (parent: Meeting): number => {
      return parent.maxParticipant;
    },

    place: (parent: Meeting): string => {
      return parent.place;
    },

    updatedAt: (parent: Meeting): Date => {
      return parent.updatedAt;
    },
    participatesUsers: async (parent: Meeting): Promise<User[]> => {
      const result = await meetingParticipatedUserLoader.load(parent.id);
      return result;
    },

    connectedReviews: async (parent: Meeting): Promise<Review[]> => {
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

    updatedAt: (parent: Review): Date => {
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
  },

  Host: {
    id: (parent: Host): string => {
      return parent.id;
    },

    nickname: (parent: Host): string => {
      return parent.nickname;
    },
  },

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      if (typeof value === 'string') {
        return new Date(value).toString();
      }
      return value.toString();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      return null;
    },
  }),
};

export default resolvers;
