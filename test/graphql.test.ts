import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import resolvers from '../src/graphql/resolver';
import typeDefs from '../src/graphql/typeDef';
import { errorHandler } from '../src/graphql/errorHandler';
import { createSchema } from './schemaUtils';

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  formatError: errorHandler,
});

const { query, mutate } = createTestClient(server);

const meetingPostParamWithDeadlinePast = {
  hostId: 'HostFirst',
  title: '미팅생성테스트. Test에 올라가나요?',
  content: '미팅이 생성됐습니다. 테스트가 잘 진행될까 궁금하다',
  startAt: '2009-01-03 12:33:33',
  endAt: '2009-01-04 12:33:33',
  deadline: '2009-01-02 12:33:33',
  maxParticipant: 4,
  place: '울산 중구 태화동',
};

const meetingPostParam = {
  hostId: 'HostFirst',
  title: '미팅생성테스트. Test에 올라가나요?',
  content: '미팅이 생성됐습니다. 테스트가 잘 진행될까 궁금하다',
  startAt: '2021-01-19 12:33:33',
  endAt: '2021-01-19 12:33:33',
  deadline: '2022-01-19 12:33:33',
  maxParticipant: 2,
  place: '울산 중구 태화동',
};

const meetingPostParamWithNull = {
  hostId: 'HostFirst',
  title: '',
  content: '빈 값 테스트. 이 미팅은 생성되면 안됩니다',
  startAt: '2009-01-03 12:33:33',
  endAt: '2009-01-04 12:33:33',
  deadline: '2009-01-02 12:33:33',
  maxParticipant: 4,
  place: '울산 중구 태화동',
};

const meetingPostParamWithDifferentType = {
  hostId: 'HostFirst',
  title: '날짜 타입 에러 테스트',
  content: '파라미터 타입 에러 테스트. 이 미팅은 생성되면 안됩니다',
  startAt: '2009-01-04 12:33:33',
  endAt: '2009-01-04 12:33:33',
  deadline: '2009-01-02 12:33:33',
  maxParticipant: '이건아니지',
  place: '울산 중구 태화동',
};

const meetingPostParamWithDifferentDateFormat = {
  hostId: 'HostFirst',
  title: '날짜 타입 에러 테스트',
  content: '파라미터 타입 에러 테스트. 이 미팅은 생성되면 안됩니다',
  startAt: '20090104 123333',
  endAt: '2009-01-04 12:33:33',
  deadline: '2009-01-02 12:33:33',
  maxParticipant: 5,
  place: '울산 중구 태화동',
};

const meetingPostParamWithSpecificCharacter = {
  hostId: 'HostFirst',
  title: "'따옴표' 포함된 생성테스트. Test에 올라가나요?",
  content: '"쌍따옴표" 미팅이 생성됐습니다. 이것도 올라가야 하는데요. 테스트가 잘 진행될까 궁금하다',
  startAt: '2021-01-19 12:33:33',
  endAt: '2021-01-19 12:33:33',
  deadline: '2021-01-19 12:33:33',
  maxParticipant: 4,
  place: '`백틱` 문자입니다. 이것도 올라가야 합니다 울산 중구 태화동',
};

const meetingPostParamUpdate = {
  hostId: 'HostFirst',
  title: "'따옴표' 포함된 생성테스트. Test에 올라가나요?",
  content: '미팅이 생성됐습니다. 테스트가 잘 진행될까 궁금하다',
  startAt: '2021-12-19 12:33:33',
  endAt: '2021-12-19 12:33:33',
  deadline: '2021-01-19 12:33:33',
  maxParticipant: 4,
  place: '울산 중구 태화동',
};

const reviewPostParam = {
  meetingId: 1,
  userId: 'UserFirst',
  title: '리뷰생성테스트',
  content: '리뷰가 잘 생성되나 궁금하네요',
};

const reviewPostParamUpdate = {
  meetingId: 1,
  userId: 'UserFirst',
  title: '리뷰생성테스트 - 업데이트용',
  content: '리뷰가 잘 생성되나 궁금하네요. 잘 바꼈을까요',
};

const reviewPostParamWithNull = {
  meetingId: 1,
  userId: 'UserFirst',
  title: '',
  content: '리뷰가 잘 생성되나 궁금하네요',
};

const reviewPostParamWithSpecificCharacter = {
  meetingId: 1,
  userId: 'UserFirst',
  title: "'따옴표' 가 들어간 제목",
  content: '"쌍따옴표"와 `백틱`이 들어간 내용입니다. 리뷰가 잘 생성되나 궁금하네요',
};

const reviewPostParamWithNoParticipant = {
  meetingId: 1,
  userId: 'UserSecond',
  title: '모임에 참가하지 않은 사람이나 생성되면 안됩니다',
  content: '리뷰가 잘 생성되나 궁금하네요',
};

// DB 생성
beforeAll(async () => {
  await createSchema();
});

test('create meeting', async (done) => {
  const CREATE_MEETING = gql`
    mutation($input: MeetingPostParam!) {
      createMeeting(input: $input) {
        id
        title
      }
    }
  `;
  const normalSuccessResult = await mutate({ mutation: CREATE_MEETING, variables: { input: meetingPostParam } });
  expect(normalSuccessResult.data.createMeeting).toEqual({ id: '2', title: '미팅생성테스트. Test에 올라가나요?' });

  const deadlinePastSuccessResult = await mutate({
    mutation: CREATE_MEETING,
    variables: { input: meetingPostParamWithDeadlinePast },
  });
  expect(deadlinePastSuccessResult.data.createMeeting).toEqual({
    id: '3',
    title: '미팅생성테스트. Test에 올라가나요?',
  });

  const specificCharcaterSuccessResult = await mutate({
    mutation: CREATE_MEETING,
    variables: { input: meetingPostParamWithSpecificCharacter },
  });
  expect(specificCharcaterSuccessResult.data.createMeeting).toEqual({
    id: '4',
    title: "'따옴표' 포함된 생성테스트. Test에 올라가나요?",
  });

  const differentTypeFailResult = await mutate({
    mutation: CREATE_MEETING,
    variables: { input: meetingPostParamWithDifferentType },
  });
  expect(differentTypeFailResult.errors).toHaveLength(1);

  const differentDateFormatFailResult = await mutate({
    mutation: CREATE_MEETING,
    variables: { input: meetingPostParamWithDifferentDateFormat },
  });
  expect(differentDateFormatFailResult.errors?.[0].message).toBe('날짜 형식이 잘못되었습니다!');

  done();
});

test('update meeting', async (done) => {
  const UPDATE_MEETING = gql`
    mutation($id: ID!, $input: MeetingPostParam!) {
      updateMeeting(id: $id, input: $input) {
        id
      }
    }
  `;

  const normalSuccessResult = await mutate({
    mutation: UPDATE_MEETING,
    variables: { id: '4', input: meetingPostParamUpdate },
  });
  expect(normalSuccessResult.data.updateMeeting).toEqual({ id: '4' });

  const nullFailResult = await mutate({
    mutation: UPDATE_MEETING,
    variables: { id: '4', input: meetingPostParamWithNull },
  });
  expect(nullFailResult.errors).toHaveLength(1);

  done();
});

test('get meeting', async (done) => {
  const GET_MEETING = gql`
    query GetMeeting($id: ID!) {
      meeting(id: $id) {
        id
        title
      }
    }
  `;

  const normalSuccessResult = await query({ query: GET_MEETING, variables: { id: 1 } });
  expect(normalSuccessResult.data.meeting).toEqual({ id: '1', title: '사전입력모임' });

  const diffTypeFailureResult = await query({ query: GET_MEETING, variables: { id: '이건머지' } });
  expect(diffTypeFailureResult.errors).toHaveLength(1);

  done();
});

test('get meetings', async (done) => {
  const GET_MEETINGS = gql`
    query GetMeetings($hostId: String, $page: Page!) {
      meetings(hostId: $hostId, page: $page) {
        totalCount
      }
    }
  `;

  const normalSuccessResult = await query({
    query: GET_MEETINGS,
    variables: { hostId: '', page: { first: 3 } },
  });
  expect(normalSuccessResult.data.meetings.totalCount).toBe(3);

  const normalWithHostIdSuccessResult = await query({
    query: GET_MEETINGS,
    variables: { hostId: 'HostFirst', page: { first: 2 } },
  });
  expect(normalWithHostIdSuccessResult.data.meetings.totalCount).toBe(2);

  const nullPageTypeFailureResult = await query({
    query: GET_MEETINGS,
    variables: { hostId: 'HostFirst', page: {} },
  });
  expect(nullPageTypeFailureResult.errors).toHaveLength(1);

  done();
});

test('delete meeting', async (done) => {
  const DELETE_MEETING = gql`
    mutation($id: ID!) {
      deleteMeeting(id: $id)
    }
  `;

  const normalSuccessResult = await mutate({
    mutation: DELETE_MEETING,
    variables: { id: 4 },
  });
  expect(normalSuccessResult.data.deleteMeeting).toBe('SUCCESS');

  const notExistFailureResult = await mutate({
    mutation: DELETE_MEETING,
    variables: { id: 1000 },
  });
  expect(notExistFailureResult.data.deleteMeeting).toBe('FAIL');
  done();
});

test('apply meeting', async (done) => {
  const PARTICIPATE_MEETING = gql`
    mutation($meetingId: Int!, $userId: String!) {
      createMeetingParticipation(meetingId: $meetingId, userId: $userId) {
        meeting {
          id
        }
        user {
          id
        }
      }
    }
  `;

  const normalSuccessResult = await mutate({
    mutation: PARTICIPATE_MEETING,
    variables: { meetingId: 2, userId: 'UserSecond' },
  });
  expect(normalSuccessResult.data.createMeetingParticipation).toEqual({
    meeting: { id: '2' },
    user: { id: 'UserSecond' },
  });

  const normalSuccessResultSecond = await mutate({
    mutation: PARTICIPATE_MEETING,
    variables: { meetingId: 2, userId: 'UserFirst' },
  });
  expect(normalSuccessResultSecond.data.createMeetingParticipation).toEqual({
    meeting: { id: '2' },
    user: { id: 'UserFirst' },
  });

  const deadlinePastFailureResult = await mutate({
    mutation: PARTICIPATE_MEETING,
    variables: { meetingId: 3, userId: 'UserFirst' },
  });
  expect(deadlinePastFailureResult.errors).toHaveLength(1);

  const meetingIdNullFailureResult = await mutate({
    mutation: PARTICIPATE_MEETING,
    variables: { meetingId: 0, userId: 'UserFirst' },
  });
  expect(meetingIdNullFailureResult.errors).toHaveLength(1);

  const userIdNullFailureResult = await mutate({
    mutation: PARTICIPATE_MEETING,
    variables: { meetingId: 2, userId: '' },
  });
  expect(userIdNullFailureResult.errors).toHaveLength(1);

  const participantMaxFailureResult = await mutate({
    mutation: PARTICIPATE_MEETING,
    variables: { meetingId: 2, userId: 'UserThird' },
  });
  expect(participantMaxFailureResult.errors).toHaveLength(1);

  done();
});

test('cancel apply meeting', async (done) => {
  const CANCEL_MEETING = gql`
    mutation($meetingId: Int!, $userId: String!) {
      deleteMeetingParticipation(meetingId: $meetingId, userId: $userId)
    }
  `;

  const normalSuccessResult = await mutate({
    mutation: CANCEL_MEETING,
    variables: { meetingId: 2, userId: 'UserSecond' },
  });
  expect(normalSuccessResult.data.deleteMeetingParticipation).toBe('SUCCESS');

  const deadlinePastFailureResult = await mutate({
    mutation: CANCEL_MEETING,
    variables: { meetingId: 1, userId: 'UserFirst' },
  });
  expect(deadlinePastFailureResult.data.deleteMeetingParticipation).toBe('FAIL');

  done();
});

test('create review', async (done) => {
  const CREATE_REVIEW = gql`
    mutation($input: ReviewPostParam!) {
      createReview(input: $input) {
        id
      }
    }
  `;

  const normalSuccessResult = await mutate({
    mutation: CREATE_REVIEW,
    variables: { input: reviewPostParam },
  });
  expect(normalSuccessResult.data.createReview.id).toBe('1');

  const specificCharacterSuccessResult = await mutate({
    mutation: CREATE_REVIEW,
    variables: { input: reviewPostParamWithSpecificCharacter },
  });
  expect(specificCharacterSuccessResult.data.createReview.id).toBe('2');

  const reviewConditionFailureResult = await mutate({
    mutation: CREATE_REVIEW,
    variables: { input: reviewPostParamWithNoParticipant },
  });
  expect(reviewConditionFailureResult.errors).toHaveLength(1);

  done();
});

test('get review', async (done) => {
  const GET_REVIEW = gql`
    query($id: ID!) {
      review(id: $id) {
        id
      }
    }
  `;

  const normalSuccessResult = await query({
    query: GET_REVIEW,
    variables: { id: 1 },
  });
  expect(normalSuccessResult.data.review.id).toBe('1');

  const diffentTypeFailureResult = await query({
    query: GET_REVIEW,
    variables: { id: -1 },
  });
  expect(diffentTypeFailureResult.errors).toHaveLength(1);

  done();
});

test('get reviews', async (done) => {
  const GET_REVIEWS = gql`
    query($meetingId: Int, $userId: String, $page: Page!) {
      reviews(meetingId: $meetingId, userId: $userId, page: $page) {
        totalCount
      }
    }
  `;

  const normalMeetingIdSuccessResult = await query({
    query: GET_REVIEWS,
    variables: { meetingId: 1, page: { first: 2 } },
  });
  expect(normalMeetingIdSuccessResult.data.reviews.totalCount).toBe(1);

  const normalUserIdSuccessResult = await query({
    query: GET_REVIEWS,
    variables: { userId: 'UserFirst', page: { first: 2 } },
  });
  expect(normalUserIdSuccessResult.data.reviews.totalCount).toBe(1);

  done();
});

test('update review', async (done) => {
  const UPDATE_REVIEW = gql`
    mutation($id: ID!, $input: ReviewPostParam!) {
      updateReview(id: $id, input: $input) {
        id
      }
    }
  `;

  const normalSuccessResult = await mutate({
    mutation: UPDATE_REVIEW,
    variables: { id: 1, input: reviewPostParamUpdate },
  });
  expect(normalSuccessResult.data.updateReview.id).toBe('1');

  const nullFailResult = await mutate({
    mutation: UPDATE_REVIEW,
    variables: { id: 1, input: reviewPostParamWithNull },
  });
  expect(nullFailResult.errors).toHaveLength(1);

  done();
});

test('delete review', async (done) => {
  const DELETE_REVIEW = gql`
    mutation($id: ID!) {
      deleteReview(id: $id)
    }
  `;

  const normalSuccessResult = await mutate({
    mutation: DELETE_REVIEW,
    variables: { id: 1 },
  });
  expect(normalSuccessResult.data.deleteReview).toBe('SUCCESS');

  const notExistFailureResult = await mutate({
    mutation: DELETE_REVIEW,
    variables: { id: 1000 },
  });
  expect(notExistFailureResult.data.deleteReview).toBe('FAIL');
  done();
});
