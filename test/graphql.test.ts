import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import resolvers from '../src/graphql/resolver';
import typeDefs from '../src/graphql/typeDef';
import { errorHandler } from '../src/graphql/errorHandler';
import { createSchema } from './schemaUtils';
import { DateFormatException } from '../src/util/customException';

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

test('create meeting with correct param', async (done) => {
  const CREATE_MEETING = gql`
    mutation($input: MeetingPostParam) {
      createMeeting(input: $input) {
        id
        title
      }
    }
  `;
  const normalSuccessResult = await mutate({ mutation: CREATE_MEETING, variables: { input: meetingPostParam } });
  expect(normalSuccessResult.data.createMeeting).toEqual({ id: 2, title: '미팅생성테스트. Test에 올라가나요?' });

  const deadlinePastSuccessResult = await mutate({
    mutation: CREATE_MEETING,
    variables: { input: meetingPostParamWithDeadlinePast },
  });
  expect(deadlinePastSuccessResult.data.createMeeting).toEqual({ id: 3, title: '미팅생성테스트. Test에 올라가나요?' });

  const specificCharcaterSuccessResult = await mutate({
    mutation: CREATE_MEETING,
    variables: { input: meetingPostParamWithSpecificCharacter },
  });
  expect(specificCharcaterSuccessResult.data.createMeeting).toEqual({
    id: 4,
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

test('select meeting', async (done) => {
  const SELECT_MEETING = gql`
    {
      meeting(id: 1) {
        id
        title
      }
    }
  `;

  const response = await query({ query: SELECT_MEETING });
  expect(response.data.meeting).toEqual({ id: 1, title: '사전입력모임' });
  done();
});

test('select meetings without hostId', async (done) => {
  const SELECT_MEETINGS = gql`
    {
      meetings(page: { pageNum: 1, pageSize: 2 }) {
        edges {
          node {
            title
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  `;

  const response = await query({ query: SELECT_MEETINGS });
  expect(response.data.meetings).toEqual({
    edges: [
      {
        cursor: 'MU1lZXRpbmc=',
        node: {
          title: '사전입력모임',
        },
      },
      {
        cursor: 'Mk1lZXRpbmc=',
        node: {
          title: '미팅생성테스트. Test에 올라가나요?',
        },
      },
    ],
    pageInfo: {
      endCursor: 'Mk1lZXRpbmc=',
      hasNextPage: true,
    },
    totalCount: 2,
  });
  done();
});
