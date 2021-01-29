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
import { NotExistsException } from '../util/customException';

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
const meetingConnectedReviewLoader = new DataLoader(
  async (meetingIds: readonly number[]) => {
    const result = await reviewServiceInstance.listAllReviews(meetingIds, []);
    return meetingIds.map((id) => result.filter((c) => c.meetingId === id));
  },
  { cache: false },
);

// 모임에 참여한 유저 리스트 dataloader
const meetingParticipatedUserLoader = new DataLoader(
  async (meetingIds: readonly number[]) => {
    const result = await userServiceInstance.listAllUsers(meetingIds);
    return meetingIds.map((id) => result.filter((c) => c.meetingId === id));
  },
  { cache: false },
);

// 호스트 dataloader
const hostLoader = new DataLoader(
  async (hostIds: readonly string[]) => {
    const result = await hostServiceInstance.getAllHost(hostIds.map((i) => i));
    const host = hostIds.map((id) => result.find((c) => c.id === id));
    if (host == undefined) {
      throw new NotExistsException();
    } else {
      return host;
    }
  },
  { cache: false },
);

const resolvers = {
  Query: {
    meeting: async (_: unknown, args: any): Promise<Meeting> => {
      const id = args.id ? Number(args.id) : 0;
      const result = await meetingServiceInstance.getMeeting(id);
      return result;
    },

    meetings: async (_: unknown, args: any): Promise<Connection<Meeting>> => {
      const hostId = args.hostId ? String(args.hostId) : '';
      const page = serviceUtilInstance.makePageType(
        args.page.pageNum,
        args.page.pageSize,
        args.page.first,
        args.page.after,
      );
      const result = await meetingServiceInstance.listMeetings(hostId, page);

      // 결과 길이가 orginFirst + 1 과 같다면 originFirst로, 아니라면 그거보다 작은 result 자체를 totalCount로 한다.
      const totalcount = result.length == page.first ? page.first - 1 : result.length;
      // 길이로 다음 페이지가 존재한느지 검사
      const hasNextPage = result.length == page.first;
      // 하나 더 많이 가져왔기에 마지막 하나는 자른다
      const nodes = hasNextPage ? result.slice(0, -1) : result;

      const edges = nodes.map((node) => {
        return {
          node: node,
          // meetingId와 'Meeting" 타입을 base64 인코딩
          cursor: serviceUtilInstance.convertCursor(node.id, 'Meeting'),
        };
      });

      return {
        totalCount: totalcount,
        pageInfo: {
          hasNextPage: hasNextPage,
          // 마지막에 위치하는 값을 endCursor로 한다.
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
      const page = serviceUtilInstance.makePageType(
        args.page.pageNum,
        args.page.pageSize,
        args.page.first,
        args.page.after,
      );
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
      const meeting: Meeting = {
        id: id,
        hostId: input.hostId,
        title: input.title,
        content: input.title,
        startAt: new Date(input.startAt),
        endAt: new Date(input.endAt),
        deadline: new Date(input.deadline),
        maxParticipant: input.maxParticipant,
        place: input.place,
        cntCurrentParticipant: 0,
        updatedAt: new Date(),
      };
      return meeting;
    },

    updateMeeting: async (_: unknown, args: any): Promise<Meeting> => {
      const id = Number(args.id);
      await meetingServiceInstance.updateMeeting(id, args.input);
      const result = await meetingServiceInstance.getMeeting(id);
      return result;
    },

    deleteMeeting: async (_: unknown, args: any): Promise<DeleteStatus> => {
      const id = args.id ? Number(args.id) : 0;
      // 삭제 성공시 SUCCESS을 반환한다.
      await meetingServiceInstance.deleteMeeting(id);
      return DeleteStatus.SUCCESS;
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
      await meetingServiceInstance.deleteMeetingParticipation(meetingId, userId);
      return DeleteStatus.SUCCESS;
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
      const review: Review = {
        id: id,
        meetingId: input.meetingId,
        userId: input.userId,
        title: input.title,
        content: input.content,
        updatedAt: new Date(),
      };
      return review;
    },

    updateReview: async (_: unknown, args: any): Promise<Review> => {
      const id = args.id ? Number(args.id) : 0;
      await reviewServiceInstance.updateReview(id, args.input);
      const review: Review = {
        id: id,
        meetingId: args.meetingId,
        userId: args.userId,
        title: args.title,
        content: args.content,
        updatedAt: new Date(),
      };
      return review;
    },

    deleteReview: async (_: unknown, args: any): Promise<DeleteStatus> => {
      const id = args.id ? Number(args.id) : 0;
      // 삭제 성공시 SUCCESS 실패시 FAIL을 반환한다
      await reviewServiceInstance.deleteReview(id);
      return DeleteStatus.SUCCESS;
    },
  },

  Meeting: {
    // 모든 미팅 조회 시를 생각해 dataloader을 이용한다.
    host: async (parent: Meeting): Promise<Host> => {
      const result = await hostLoader.load(parent.hostId);
      return result;
    },

    // 모든 미팅, 각 미팅의 참가자 조회 시를 생각해 dataloader 사용
    participatesUsers: async (parent: Meeting): Promise<User[]> => {
      const result = await meetingParticipatedUserLoader.load(parent.id);
      return result;
    },

    // 모든 미팅에 연결되는 후기 조회 시
    connectedReviews: async (parent: Meeting): Promise<Review[]> => {
      const result = await meetingConnectedReviewLoader.load(parent.id);
      return result;
    },
  },

  Review: {
    postedBy: async (parent: Review): Promise<User> => {
      const result = await userServiceInstance.getUser(parent.userId);
      return result;
    },
  },

  // Date를 문자열로 표현 ( 표준시 추가)
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
