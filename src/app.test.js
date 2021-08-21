import request from 'supertest';
import server from './main';
import { test } from '@jest/globals';
import User from './models/users';

const EMAIL = 'test@gmail.com';
const USERNAME = '양채훈';
const PASSWORD = '123456';

beforeAll(async () => {
  console.log('Jest starting!');
  await request(server).get('/');
});

afterAll(() => {
  server.close();
  console.log('server closed!');
});

describe('회원가입 POST /api/auth/register', () => {
  test('회원가입 성공', async () => {
    const name = '테스팅';
    const response = await request(server)
      .post('/api/auth/register')
      .send({ email: `${name}@test.com`, username: name, password: '123456' });
    expect(response.status).toBe(200);
    expect(response.body.username).toBe(name);
    expect(response.body.email).toBe(`${name}@test.com`);
    User.deleteOne({ username: name }, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  test('회원가입 중복', async () => {
    const response = await await request(server)
      .post('/api/auth/register')
      .send({ username: USERNAME, email: EMAIL, password: PASSWORD });
    expect(response.status).toBe(409);
  });

  test('회원가입 입력 항복 빼먹음', async () => {
    const response = await await request(server).post('/api/auth/register').send({ username: USERNAME, email: EMAIL });
    expect(response.status).toBe(400);
  });
});

describe('로그인 POST /api/auth/login', () => {
  test('로그인 성공', async () => {
    const response = await request(server).post('/api/auth/login').send({ email: EMAIL, password: PASSWORD });
    expect(response.status).toBe(200);
    expect(response.body.username).toBe(USERNAME);
    expect(response.body.email).toBe(EMAIL);
  });

  test('잘못된 이메일', async () => {
    const wrongEmail = '123456';
    const response = await request(server).post('/api/auth/login').send({ email: wrongEmail, password: PASSWORD });
    expect(response.status).toBe(401);
  });

  test('잘못된 비밀번호', async () => {
    const wrongPassword = '123456789';
    const response = await request(server).post('/api/auth/login').send({ email: EMAIL, password: wrongPassword });
    expect(response.status).toBe(401);
  });

  test('비어있는 폼 전송', async () => {
    const emptyEmail = '';
    const emptyPassword = '';
    const response = await request(server).post('/api/auth/login').send({ email: emptyEmail, password: emptyPassword });
    expect(response.status).toBe(401);
  });
});

describe('로그인 체크 GET /api/auth/check', () => {
  test('비로그인 상태', async () => {
    const response = await request(server).get('/api/auth/check');
    expect(response.status).toBe(401);
  });

  test('로그인 상태', async () => {
    const loginResponse = await request(server).post('/api/auth/login').send({ email: EMAIL, password: PASSWORD });
    const cookie = loginResponse.headers['set-cookie'];
    const response = await request(server).get('/api/auth/check').set('Cookie', cookie);
    expect(response.status).toBe(200);
    expect(response.body.username).toBe(USERNAME);
    expect(response.body.email).toBe(EMAIL);
  });
});

describe('로그아웃 POST /api/auth/logout', () => {
  test('로그아웃', async () => {
    const loginResponse = await request(server).post('/api/auth/login').send({ email: EMAIL, password: PASSWORD });
    const cookie = loginResponse.headers['set-cookie'];
    const response = await request(server).post('/api/auth/logout').set('Cookie', cookie);
    expect(response.status).toBe(204);
  });
});

describe('글 작성 [GET/POST/DELETE/PATCH] /api/posts', () => {
  test('로그인 하지 않고 글 작성', async () => {
    const response = await request(server).post('/api/posts').send({ title: '제목', body: '내용', owner: '테스터' });
    expect(response.status).toBe(401);
  });

  test('로그인 하지 않고 글 조회', async () => {
    const response = await request(server).get('/api/posts');
    expect(response.status).toBe(401);
  });

  test('글 작성 및 수정', async () => {
    const loginResponse = await request(server).post('/api/auth/login').send({ email: EMAIL, password: PASSWORD });
    const cookie = loginResponse.headers['set-cookie'];

    // 글 작성
    const response = await request(server)
      .post('/api/posts')
      .set('Cookie', cookie)
      .send({ title: '제목', body: '내용', owner: '테스터' });
    const id = response.body._id;
    expect(response.body.title).toBe('제목');
    expect(response.body.body).toBe('내용');
    expect(response.body.user.username).toBe(USERNAME);

    // 수정
    const patchResponse = await request(server)
      .patch(`/api/posts/${id}`)
      .set('Cookie', cookie)
      .send({ title: '제목 수정' });
    expect(patchResponse.body.title).toBe('제목 수정');
    expect(patchResponse.body.body).toBe('내용');
    expect(patchResponse.body.user.username).toBe(USERNAME);

    await request(server).delete(`/api/posts/${id}`).set('Cookie', cookie);
  });
});

describe('회원 및 글 리스트 받기 GET /api/list', () => {
  test('로그인 하지 않고 리스트 요청', async () => {
    const response = await request(server).get('/api/list').send();
    expect(response.status).toBe(401);
  });

  test('리스트 요청', async () => {
    const loginResponse = await request(server).post('/api/auth/login').send({ email: EMAIL, password: PASSWORD });
    const cookie = loginResponse.headers['set-cookie'];

    const response = await request(server).get('/api/list').set('Cookie', cookie).send();
    expect(response.body['테스터'][0].title).toBe('제목');
  });
});
