import { App } from '../src/App';
import request from 'supertest';
import { createSchema } from './schemaUtils';

const app = new App();
app.run(4080);
const express = app.getExpress();

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
  startAt: '2009-01-04T12:33:33',
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

// 모임 등록 테스트 1 - 정상
describe('Test post /meetings', () => {
  test('register meeting with correct params -> should return ok', async (done) => {
    const res = await request(express).post('/meetings').send(meetingPostParam);
    expect(res.status).toBe(201);

    done();
  });
});

// 모임 등록 테스트 2 - 등록날짜 옛날 버전
describe('Test post /meetings', () => {
  test('register meeting with correct params, deadline with past date -> should return ok', async (done) => {
    const res = await request(express).post('/meetings').send(meetingPostParamWithDeadlinePast);
    expect(res.status).toBe(201);

    done();
  });
});

// 모임 등록, 조회 테스트 3 - 따옴표, 쌍따옴표, 백틱 검사
describe('Test post /meetings', () => {
  test('register meeting with correct params(include Quotes, Double Qoutes, BackTick) -> should return ok', async (done) => {
    const res = await request(express).post('/meetings').send(meetingPostParamWithSpecificCharacter);
    expect(res.status).toBe(201);
    done();
  });

  test('get meetingId meeting with correct params(include Quotes, Double Qoutes, BackTick) -> should return ok', async (done) => {
    const res = await request(express).get('/meetings/4');
    expect(res.status).toBe(200);
    expect(res.body.result.title).toStrictEqual("'따옴표' 포함된 생성테스트. Test에 올라가나요?");
    expect(res.body.result.content).toStrictEqual(
      '"쌍따옴표" 미팅이 생성됐습니다. 이것도 올라가야 하는데요. 테스트가 잘 진행될까 궁금하다',
    );
    expect(res.body.result.place).toStrictEqual('`백틱` 문자입니다. 이것도 올라가야 합니다 울산 중구 태화동');
    done();
  });
});

// 모임 등록 테스트 4 - 등록 파라미터 중 타입이 다른 경우
describe('Test post /meetings', () => {
  test('register meeting with params of different type -> should return 500', async (done) => {
    const res = await request(express).post('/meetings').send(meetingPostParamWithDifferentType);
    expect(res.status).toBe(400);
    done();
  });
});

// 모임 등록 테스트 5- 등록 파라미터 중 날짜의 포맷이 정해진 포맷과 다른 경우
describe('Test post /meetings', () => {
  test('register meeting with params of different type -> should return 500', async (done) => {
    const res = await request(express).post('/meetings').send(meetingPostParamWithDifferentDateFormat);
    expect(res.status).toBe(400);
    done();
  });
});

// 모임 수정 테스트  - 4번 미팅 - 정상
describe('Test put /meetings/4', () => {
  test('update meeting with correct params -> should return ok', async (done) => {
    const res = await request(express).put('/meetings/4').send(meetingPostParamUpdate);
    // expect(res.body).toStrictEqual({});
    expect(res.status).toBe(200);
    done();
  });
});

// 모임 수정 테스트 - Null Exception - path가 undefined 인 경우
describe('Test put /meetings/', () => {
  test('update meeting with incorrect params -> should return Bad Reqeust', async (done) => {
    const res = await request(express).put('/meetings').send(meetingPostParam);
    expect(res.status).toBe(404);
    done();
  });
});

// 모임 수정 테스트 - 수정할 param 중 null이 포함된 경우
describe('Test put /meetings/4', () => {
  test('update meeting with Null Value params -> should return Bad Reqeust', async (done) => {
    const res = await request(express).put('/meetings/4').send(meetingPostParamWithNull);
    expect(res.status).toBe(400);
    done();
  });
});

// 특정 모임 가져오기 테스트 - 정상
describe('Test get /meetings/1', () => {
  test('get meetingId meeting with correct params -> should return ok', async (done) => {
    const res = await request(express).get('/meetings/1');
    expect(res.status).toBe(200);
    expect(res.body?.result.hostId).toStrictEqual('HostFirst');
    done();
  });
});

// 특정 모임 가져오기 테스트 - Null Exception - path가 undefined 인 경우
describe('Test get /meetings/undefined', () => {
  test('get meetingId meeting with incorrect params -> should return Bad Request', async (done) => {
    const res = await request(express).get('/meetings/');
    expect(res.status).toBe(400);
    done();
  });
});

// 특정 모임 가져오기 테스트 - Type Exception - 타입이 다른 경우
describe('Test get /meetings/differentType', () => {
  test('get meetingId meeting with incorrect params -> should return Bad Request', async (done) => {
    const res = await request(express).get('/meetings/differentType');
    expect(res.status).toBe(400);
    done();
  });
});

// 전체 모임 가져오기 테스트 - 정상
describe('Test get /meetings?hostId=&pageNum=1&pageSize=3', () => {
  test('get meeting list with correct params -> should return ok', async (done) => {
    const res = await request(express).get('/meetings?hostId=&pageNum=1&pageSize=3');
    expect(res.status).toBe(200);
    expect(res.body.result).toHaveLength(3);
    done();
  });
});

// 전체 모임 가져오기 테스트 - 총 meeting 수 : 4 , pageNum = 2, pageSize = 3 으로 하여 하나만 리턴되는지 확인
describe('Test get /meetings?hostId=&pageNum=2&pageSize=3', () => {
  test('get meeting list with correct params -> should return ok', async (done) => {
    const res = await request(express).get('/meetings?hostId=&pageNum=2&pageSize=3');
    expect(res.status).toBe(200);
    expect(res.body.result).toHaveLength(1);
    done();
  });
});

// 전체 모임 가져오기 테스트 - 총 meeting 수 : 4 , pageNum = 3, pageSize = 3 으로 하여 빈 배열 리턴되는지 확인
describe('Test get /meetings?hostId=&pageNum=3&pageSize=3', () => {
  test('get meeting list with correct params -> should return ok', async (done) => {
    const res = await request(express).get('/meetings?hostId=&pageNum=3&pageSize=3');
    expect(res.status).toBe(200);
    expect(res.body.result).toHaveLength(0);

    done();
  });
});

// 특정 호스트의 모임 가져오기 테스트 - 정상
describe('Test get /meetings?hostId=HostFirst&pageNum=1&pageSize=2', () => {
  test('get meeting list with correct params -> should return ok', async (done) => {
    const res = await request(express).get('/meetings?hostId=HostFirst&pageNum=1&pageSize=2');
    expect(res.status).toBe(200);
    done();
  });
});

// 특정 호스트의 모임 가져오기 테스트 - Null Exception - pageNum이 Null일 때 테스트
describe('Test get /meetings?hostId=HostFirst&pageNum=&pageSize=2', () => {
  test('get meeting list with incorrect params -> should return Bad Requesst', async (done) => {
    const res = await request(express).get('/meetings?hostId=HostFirst&pageNum=&pageSize=2');
    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      message: 'pageNum cannot be null',
      type: 'External Client Error',
    });
    done();
  });
});

// 특정 호스트의 모임 가져오기 테스트 - Null Exception - pageSize이 Null일 때 테스트
describe('Test get /meetings?hostId=HostFirst&pageNum=1&pageSize=', () => {
  test('get meeting list with incorrect params -> should return Bad Requesst', async (done) => {
    const res = await request(express).get('/meetings?hostId=HostFirst&pageNum=1&pageSize=');
    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      message: 'pageSize cannot be null',
      type: 'External Client Error',
    });
    done();
  });
});

// 모임 취소 테스트 - Null Exception - path가 undefined 인 경우
describe('Test delete /meetings/undefined', () => {
  test('delete meeting with Null Value params -> should return Bad Reqeust', async (done) => {
    const res = await request(express).delete('/meetings/');
    expect(res.status).toBe(404);
    done();
  });
});

// 모임 취소 테스트 - 정상
describe('Test delete /meetings/4', () => {
  test('delete meeting with correct params -> should return OK', async (done) => {
    const res = await request(express).delete('/meetings/4');
    expect(res.status).toBe(200);
    done();
  });
});

// 미팅 참가 신청 테스트 - 정상
describe('Test post /meetings/2/users', () => {
  test('insert meeting participation with correct params -> should return ok', async (done) => {
    const res = await request(express).post('/meetings/2/users').send({ userId: 'UserSecond' });
    expect(res.status).toBe(201);
    done();
  });
});

describe('Test post /meetings/2/users', () => {
  test('insert meeting participation with correct params -> should return ok', async (done) => {
    const res = await request(express).post('/meetings/2/users').send({ userId: 'UserFirst' });
    expect(res.status).toBe(201);
    done();
  });
});

// 미팅 참가 신청 테스트 - Custom Exception 마감시간이 지난 후 신청하려는 경우
describe('Test post /meetings/3/users', () => {
  test('insert meeting participation with unavailable condition -> should return Bad Request', async (done) => {
    const res = await request(express).post('/meetings/3/users').send({ userId: 'UserFirst' });
    expect(res.status).toBe(400);
    expect(res.body).toStrictEqual({
      message: '마감 시간이 지났습니다',
      type: 'External Client Error',
    });
    done();
  });
});

// 미팅 참가 신청 테스트 - Null Exception - meetingID가 null 인 경우 - 404
describe('Test post /meetings//users', () => {
  test('insert meeting participation with incorrect params -> should return Bad Request', async (done) => {
    const res = await request(express).post('/meetings//users').send({ userId: 'UserFirst' });
    expect(res.status).toBe(404);
    done();
  });
});

// 미팅 참가 신청 테스트 - Null Exception - userID가 null 인 경우
describe('Test post /meetings/2/users', () => {
  test('insert meeting participation with incorrect params -> should return Bad Request', async (done) => {
    const res = await request(express).post('/meetings/2/users').send({});
    expect(res.status).toBe(400);
    done();
  });
});

// 미팅 참가 신청 테스트 - FullParticipationException - 참가인원이 꽉 찬 경우
describe('Test post /meetings/2/users', () => {
  test('insert meeting participation with incorrect logic -> should return Bad Request', async (done) => {
    const res = await request(express).post('/meetings/2/users').send({ userId: 'UserThird' });
    expect(res.status).toBe(400);
    done();
  });
});

// 미팅 참가 신청 취소 테스트 - 정상적인 경우
describe('Test delete /meetings/1/users/UserSecond', () => {
  test('delete meeting participation with correct params and logic-> should return ok', async (done) => {
    const res = await request(express).delete('/meetings/2/users/UserSecond');
    expect(res.status).toBe(200);
    done();
  });
});

// 미팅 참가 신청 취소 테스트 - Null Exception - path가 undefined 인 경우
describe('Test delete /meetings/2/users/', () => {
  test('delete meeting participation with incorrect param-> should return Bad Request', async (done) => {
    const res = await request(express).delete('/meetings/1/users/');
    expect(res.status).toBe(404);
    done();
  });
});

// 미팅 참가 신청 취소 테스트 - TimeLimit Exception - 마감시간이 지난 경우
describe('Test delete /meetings/1/users/', () => {
  test('delete meeting participation with incorrect logic-> should return Bad Request', async (done) => {
    const res = await request(express).delete('/meetings/1/users/UserFirst');
    expect(res.status).toBe(400);
    done();
  });
});

// 리뷰 등록 테스트 - 정상
describe('Test post /reviews', () => {
  test('post review with correct params-> should return OK', async (done) => {
    const res = await request(express).post('/reviews').send(reviewPostParam);
    expect(res.status).toBe(201);
    done();
  });
});

// 리뷰 등록 테스트 - NullException - path가 undefined 인 경우
describe('Test post /reviews', () => {
  test('post review with incorrect params-> should return Bad Request', async (done) => {
    const res = await request(express).post('/reviews').send(reviewPostParamWithNull);
    expect(res.status).toBe(400);
    done();
  });
});

// 리뷰 등록 테스트 - 특수문자 - 따옴표, 쌍따옴표, 백틱
describe('Test post /reviews', () => {
  test('post review with specific character params-> should return OK', async (done) => {
    const res = await request(express).post('/reviews').send(reviewPostParamWithSpecificCharacter);
    expect(res.status).toBe(201);
    done();
  });

  test('get review with specific character params -> should return OK', async (done) => {
    const res = await request(express).get('/reviews/2');
    // expect(res.status).toBe(200);
    expect(res.body.result.title).toStrictEqual("'따옴표' 가 들어간 제목");
    expect(res.body.result.content).toStrictEqual(
      '"쌍따옴표"와 `백틱`이 들어간 내용입니다. 리뷰가 잘 생성되나 궁금하네요',
    );
    done();
  });
});

// 리뷰 등록 테스트 - ReviewConditionException - 모임에 참가하지 않은 유저인 경우, 또는 노쇼한 사람인 경우
describe('Test post /reviews', () => {
  test('post review with incorrect logic -> should return Bad Request', async (done) => {
    const res = await request(express).post('/reviews').send(reviewPostParamWithNoParticipant);
    expect(res.status).toBe(400);
    done();
  });
});

// 리뷰 조회 테스트 - 특정 리뷰 - 정상
describe('Test get /reviews/1', () => {
  test('get review with correct param -> should return OK', async (done) => {
    const res = await request(express).get('/reviews/1');
    expect(res.status).toBe(200);
    expect(res.body.result.title).toStrictEqual('리뷰생성테스트');
    done();
  });
});

// 리뷰 조회 테스트 - 특정 리뷰 - path Type error (number -> string)
describe('Test get /reviews/-1', () => {
  test('get review with incorrect param -> should return 400', async (done) => {
    const res = await request(express).get('/reviews/-1');
    expect(res.status).toBe(400);
    done();
  });
});

// 리뷰 조회 테스트 - 특정 미팅 - 정상
describe('Test get /reviews?meetingId=1&pageNum=1&pageSize=2', () => {
  test('get review with correct param -> should return OK', async (done) => {
    const res = await request(express).get('/reviews?meetingId=1&pageNum=1&pageSize=2');
    expect(res.status).toBe(200);
    expect(res.body.result).toHaveLength(2);
    done();
  });
});

// 리뷰 조회 테스트 - 특정 유저 - 정상
describe('Test get /reviews?userId=UserFirst&pageNum=1&pageSize=2', () => {
  test('get review with correct param -> should return OK', async (done) => {
    const res = await request(express).get('/reviews?userId=UserFirst&pageNum=1&pageSize=2');
    expect(res.status).toBe(200);
    expect(res.body.result).toHaveLength(2);
    done();
  });
});

// 리뷰 수정 테스트 - 정상
describe('Test put /reviews/1', () => {
  test('update review with correct param -> should return OK', async (done) => {
    const res = await request(express).put('/reviews/1').send(reviewPostParamUpdate);
    expect(res.status).toBe(200);
    done();
  });
});

// 리뷰 수정 테스트 - Null Exception - 입력한 param 중 일부가 null인 경우
describe('Test put /reviews/1', () => {
  test('update review with incorrect param -> should return Bad Request', async (done) => {
    const res = await request(express).put('/reviews/1').send(reviewPostParamWithNull);
    expect(res.status).toBe(400);
    done();
  });
});

// 리뷰 삭제 테스트 - Null Exception - path가 undefined 인 경우
describe('Test delete /reviews/', () => {
  test('delete review with incorrect param -> should return Bad Request', async (done) => {
    const res = await request(express).delete('/reviews/');
    expect(res.status).toBe(404);
    done();
  });
});

// 리뷰 삭제 테스트 - 정상
describe('Test delete /reviews/1', () => {
  test('delete review with correct param -> should return OK', async (done) => {
    const res = await request(express).delete('/reviews/1');
    expect(res.status).toBe(200);
    done();
  });
});
