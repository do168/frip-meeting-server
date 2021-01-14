import { App } from '../src/App';
import request from 'supertest';
import { createSchema } from './schemaUtils';

const app = new App();
app.run(4080);
const meetingPostParam = {
  hostId: 'testid',
  title: '미팅생성',
  content: '미팅이 생성됐습니다. 테스트가 잘 진행될까 궁금하다',
  startAt: '2009-01-03 12:33:33',
  endAt: '2009-01-04 12:33:33',
  deadline: '2009-01-02 12:33:33',
  maxParticipant: 4,
  place: '울산 중구 태화동',
};

beforeAll(async () => {
  await createSchema();
});

// test('two plus two is four', () => {
//   expect(2 + 2).toBe(4);
// });

describe('Test get /meetings', () => {
  test('register meeting with correct params -> should return ok', async (done) => {
    const res = await request(app.express).get('/meetings').send({
      hostId: 'testid',
      pageNum: 1,
    });
    expect(res.status).toBe(200);
    done();
  });
});

describe('Test post /meetings', () => {
  test('register meeting with correct params -> should return ok', async (done) => {
    const res = await request(app.express).post('/meetings').send({
      meetingPostParam
    });
    expect(res.body).toBe('모임 생성 완료!');
    expect(res.status).toBe(201);
    done();
  });
});
