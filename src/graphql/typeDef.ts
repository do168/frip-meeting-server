import { gql } from 'apollo-server-express';
import { type } from 'os';

const typeDefs = gql`
  type Query {
    meetings(hostId: String!, page: Page): [Meeting]!
    meeting(id: Int!): Meeting!

    reviews(meetingId: Int!, userId: String!, page: Page): [Review]!
    review(id: Int!): Review!
  }

  type Mutation {
    createMeeting(input: MeetingPostParam): PostReturn
    updateMeeting(id: Int!, input: MeetingPostParam): Int
    deleteMeeting(id: Int!): Int
    createMeetingParticipation(meetingId: Int, userId: String): PostReturn
    deleteMeetingParticipation(meetingId: Int, userId: String): Int!
    updateAttendance(meetingId: Int!, userId: String!): Int

    createReview(input: ReviewPostParam): PostReturn
    updateReview(id: Int!, input: ReviewPostParam): Int
    deleteReview(id: Int!): Int
  }

  input MeetingPostParam {
    hostId: String
    title: String
    content: String
    startAt: String
    endAt: String
    deadline: String
    maxParticipant: Int
    place: String
  }

  input ReviewPostParam {
    meetingId: Int
    userId: String
    title: String
    content: String
  }

  input Page {
    "this is Page type!"
    pageNum: Int
    pageSize: Int
  }

  type Meeting {
    "this is Meeting type!"
    id: Int!
    hostId: String
    title: String
    content: String
    startAt: String
    endAt: String
    deadline: String
    maxParticipant: Int
    place: String
    updatedAt: String
    currentParticipant: Int!
  }

  type Review {
    "this is Review type!"
    userId: String
    title: String
    content: String
    updatedAt: String
  }

  type PostReturn {
    "this is PostReturn type!"
    affectedRows: Int
    insertId: Int
  }
`;

export default typeDefs;
