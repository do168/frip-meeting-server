import { gql } from 'apollo-server';
import { type } from 'os';

const typeDefs = gql`
  type Query {
    meetings(hostId: String!, page: Page): [Meeting]!
    meeting(id: Int!): Meeting!
    
    reviews(meetingId: Int!, userId: String!, page: Page): [Review]!
    review(id: Int!): Review!
  }

  type Mutation {
    createMeeting ( input: MeetingPostParam ): Meeting!
    updateMeeting ( id: Int!, input: MeetingPostParam ): Meeting!
    deleteMeeting ( id: Int! ): Boolean!
    createMeetingParticipation ( meetingId: Int, userId: String ): MeetingParticipation
    deleteMeetingParticipation ( meetingId: Int, userId: String ): Boolean!
    updateAttendance ( meetingId: Int!, userId: String! ): 

    createReview ( input: ReviewPostParam ): Review!
    updateReview ( id: Int!, input: ReviewPostParam ): Review!
    deleteReview ( id: Int! ): Boolean!

  }

  input MeetingPostParam {
    hostId: String
    title: String
    content: String
    startAt: String
    endAt: String
    deadline: String
    maxParticipant: String
    place: String
  }

  input ReviewPostParam {
    meetingId: Int
    userId: Stirng
    title: String
    content: String
  }

  type Meeting @key(fields: "id") {
    "this is Meeting type!"
    id: Int!,
    hostId: String,
    title: String,
    content: Stirng,
    startAt: String,
    endAt: String,
    deadline: String,
    maxParticipant: Int,
    place: Stirng,
    updatedAt: String,
    currentParticipant: Int
  }

  type Review @key(fields: "id"){
    "this is Review type!"
    userId: String,
    title: String,
    content: String,
    updatedAt: String
  }

  type Page {
    "this is Page type!"
    pageNum: Int,
    pageSize: Int
  }
`;

export default typeDefs;
