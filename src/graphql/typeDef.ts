import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    meetings(hostId: String, page: Page!): MeetingConnection!
    meeting(id: Int!): Meeting!

    reviews(meetingId: Int!, userId: String!, page: Page): [Review!]
    review(id: Int!): Review!
  }

  type Mutation {
    createMeeting(input: MeetingPostParam): Meeting!
    updateMeeting(id: Int!, input: MeetingPostParam): Int
    deleteMeeting(id: Int!): Int
    createMeetingParticipation(meetingId: Int, userId: String): Participation!
    deleteMeetingParticipation(meetingId: Int, userId: String): Int!
    updateAttendance(meetingId: Int!, userId: String!): Int

    createReview(input: ReviewPostParam): Review!
    updateReview(id: Int!, input: ReviewPostParam): Int
    deleteReview(id: Int!): Int
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
    pageNum: Int!
    pageSize: Int!
  }

  type Meeting {
    " 모임 ID"
    id: Int!

    " 모임 등록 호스트 정보 "
    host: Host!

    " 모임 제목 "
    title: String!

    " 모임 내용 "
    content: String!

    " 모임 시작 시간 "
    startAt: String!

    " 모임 종료 시간 "
    endAt: String!

    " 모임 마감 시간 "
    deadline: String!

    " 모임 참가 최대 인원 "
    maxParticipant: Int!

    " 모임 장소 "
    place: String!

    " 모임 등록글 업데이트 시간 "
    updatedAt: String

    " 현재 참가 유저"
    participatesUsers: UserParticipatesConnection!

    " 모임 후기 "
    reviews: [Review!]
  }

  type Review {
    " 리뷰 ID "
    id: Int!

    " 작성자 "
    postedBy: User!

    " 제목 "
    title: String

    " 내용 "
    content: String

    " 등록 또는 수정 시간 "
    updatedAt: String
  }

  type User {
    " 유저 ID "
    id: String!

    " 유저 닉네임 "
    nickname: String!

    " 유저가 참가한 미팅 "
    participatesMeetings: UserParticipatesConnection!

    " 유저가 작성한 후기 "
    postedReviews: ReviewConnection!
  }

  type Host {
    " 호스트 ID "
    id: String!

    " 호스트 닉네임 "
    nickname: String!

    " 등록한 모임 "
    postedMeetings: MeetingConnection
  }

  type Participation {
    " 참가신청 유저 "
    user: User!

    " 참가신청 모임 "
    meeting: Meeting!

    " 신청 시간 "
    applyAt: String!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String
  }

  type MeetingConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [MeetingEdge!]
  }

  type MeetingEdge {
    cursor: String!
    node: Meeting
  }

  type ReviewConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [ReviewEdge!]
  }

  type ReviewEdge {
    cursor: String!
    node: Review
  }

  type UserParticipatesConnection {
    totalCount: Int!
    pageInfo: PageInfo!
    edges: [UserParticipatesEdge!]
  }

  type UserParticipatesEdge {
    cursor: String!
    node: Participation
  }
`;

export default typeDefs;
