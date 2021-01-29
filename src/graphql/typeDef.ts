import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum DeleteStatus {
    " 삭제 성공 "
    SUCCESS
  }
  type Query {
    meetings(hostId: String, page: Page!): MeetingConnection!
    meeting(id: ID!): Meeting!

    reviews(meetingId: Int, userId: String, page: Page!): ReviewConnection!
    review(id: ID!): Review!
  }

  type Mutation {
    createMeeting(input: MeetingPostParam!): Meeting!
    updateMeeting(id: ID!, input: MeetingPostParam!): Meeting!
    deleteMeeting(id: ID!): DeleteStatus!
    createMeetingParticipation(meetingId: Int!, userId: String!): Participation!
    deleteMeetingParticipation(meetingId: Int!, userId: String!): DeleteStatus!
    updateAttendance(meetingId: Int!, userId: String!): Participation!

    createReview(input: ReviewPostParam!): Review!
    updateReview(id: ID!, input: ReviewPostParam!): Review!
    deleteReview(id: ID!): DeleteStatus!
  }

  input MeetingPostParam {
    hostId: String!
    title: String!
    content: String!
    startAt: String!
    endAt: String!
    deadline: String!
    maxParticipant: Int!
    place: String!
  }

  input ReviewPostParam {
    meetingId: Int!
    userId: String!
    title: String!
    content: String!
  }

  input Page {
    "this is Page type!"
    pageNum: Int
    pageSize: Int
    first: Int
    after: String
  }

  type Meeting {
    " 모임 ID"
    id: ID!

    " 모임 등록 호스트 정보 "
    host: Host!

    " 모임 제목 "
    title: String!

    " 모임 내용 "
    content: String!

    " 모임 시작 시간 "
    startAt: Date!

    " 모임 종료 시간 "
    endAt: Date!

    " 모임 마감 시간 "
    deadline: Date!

    " 모임 참가 최대 인원 "
    maxParticipant: Int!

    " 모임 장소 "
    place: String!

    " 모임 등록글 업데이트 시간 "
    updatedAt: Date!

    " 현재 참가 유저"
    participatesUsers: [User!]!

    " 모임 후기 "
    connectedReviews: [Review!]!
  }

  type Review {
    " 리뷰 ID "
    id: ID!

    " 작성자 "
    postedBy: User!

    " 제목 "
    title: String!

    " 내용 "
    content: String!

    " 등록 또는 수정 시간 "
    updatedAt: Date!
  }

  type User {
    " 유저 ID "
    id: ID!

    " 유저 닉네임 "
    nickname: String!
  }

  type Host {
    " 호스트 ID "
    id: ID!

    " 호스트 닉네임 "
    nickname: String!
  }

  type Participation {
    " 참가신청 유저 "
    user: User!

    " 참가신청 모임 "
    meeting: Meeting!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type MeetingConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [MeetingEdge!]!
  }

  type MeetingEdge {
    cursor: String!
    node: Meeting!
  }

  type ReviewConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [ReviewEdge!]!
  }

  type ReviewEdge {
    cursor: String!
    node: Review!
  }

  scalar Date
`;

export default typeDefs;
