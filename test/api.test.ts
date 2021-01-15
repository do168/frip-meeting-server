import { App } from '../src/App';
import request from 'supertest';
import { createSchema } from './schemaUtils';

const app = new App();
app.run(4080);

const meetingPostParam = {
  hostId: 'HostFirst',
  title: '미팅생성테스트. Test에 올라가나요?',
  content: '미팅이 생성됐습니다. 테스트가 잘 진행될까 궁금하다',
  startAt: '2009-01-03 12:33:33',
  endAt: '2009-01-04 12:33:33',
  deadline: '2009-01-02 12:33:33',
  maxParticipant: 4,
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
  startAt: '555',
  endAt: '2009-01-04 12:33:33',
  deadline: '2009-01-02 12:33:33',
  maxParticipant: 4,
  place: '울산 중구 태화동',
};

const reviewPostParam = {
  meetingId: 1,
  userId: 'UserFirst',
  title: '리뷰생성테스트',
  content: '리뷰가 잘 생성되나 궁금하네요',
};

beforeAll(async () => {
  await createSchema();
});

// 모임 등록 테스트
describe('Test post /meetings', () => {
  test('register meeting with correct params -> should return ok', async (done) => {
    const res = await request(app.express).post('/meetings').send(meetingPostParam);
    expect(res.status).toBe(201);

    done();
  });
});

// 등록 파라미터 중 일부가 null 값인 경우
describe('Test post /meetings', () => {
  test('register meeting with incorrect params -> should return Bad Request', async (done) => {
    const res = await request(app.express).post('/meetings').send(meetingPostParamWithNull);
    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      // toBe로 비교시 배열때문에 'Received: serializes to the same string'가 난다. 'https://github.com/glennsl/bs-jest/issues/53' 참고
      message: 'title cannot be null',
      type: 'External Client Error',
    });
    done();
  });
});

// 등록 파라미터 중 날짜를 나타내는 파라미터의 타입이 다른 경우 - 이 경우는 프론트에서 처리해서 줘야할듯싶다.
describe('Test post /meetings', () => {
  test('register meeting with params of different type -> should return Bad Request', async (done) => {
    const res = await request(app.express).post('/meetings').send(meetingPostParamWithDifferentType);
    expect(res.status).toBe(500);
    expect(res.body).toStrictEqual({
      // toBe로 비교시 배열때문에 'Received: serializes to the same string'가 난다. 'https://github.com/glennsl/bs-jest/issues/53' 참고
      message: 'internal error',
      type: 'internal',
    });
    done();
  });
});

// 특정 호스트의 모임 가져오기 테스트
describe('Test get /meetings?hostId=HostFirst&pageNum=1', () => {
  test('get meeting list with correct params -> should return ok', async (done) => {
    const res = await request(app.express).get('/meetings?hostId=HostFirst&pageNum=1');
    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      // toBe로 비교시 배열때문에 'Received: serializes to the same string'가 난다. 'https://github.com/glennsl/bs-jest/issues/53' 참고
      result: [
        {
          id: 1,
          title: '미팅생성테스트. Test에 올라가나요?',
          deadline: '2009-01-02T03:33:33.000Z',
        },
      ],
    });
    done();
  });
});

// pageNum이 Null일 때 테스트
describe('Test get /meetings?hostId=HostFirst&pageNum=', () => {
  test('register meeting with correct params -> should return ok', async (done) => {
    const res = await request(app.express).get('/meetings?hostId=HostFirst&pageNum=');
    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      // toBe로 비교시 배열때문에 'Received: serializes to the same string'가 난다. 'https://github.com/glennsl/bs-jest/issues/53' 참고
      message: 'pageNum cannot be null',
      type: 'External Client Error',
    });
    done();
  });
});
