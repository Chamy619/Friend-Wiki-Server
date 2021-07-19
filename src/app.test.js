import request from 'supertest';
import server from './main';
import { test } from '@jest/globals';
import User from './models/users';

beforeAll(async () => {
  console.log('Jest starting!');
});

afterAll(() => {
  server.close();
  console.log('server closed!');
});

test('진입 테스트', async () => {
  const response = await request(server).get('/');
  expect(response.status).toBe(200);
  expect(response.text).toBe('hello world');
});

test('라우터 테스트', async () => {
  const response = await request(server).get('/api/test');
  expect(response.status).toBe(200);
  expect(response.text).toBe('테스트');
});

describe('회원가입 POST /api/auth/register', () => {
  test('회원가입 성공', async () => {
    const name = Math.random().toString(36).substr(2, 11);
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
      .send({ username: '양채훈', email: 'test@gmail.com', password: '123456' });
    expect(response.status).toBe(409);
  });

  test('회원가입 입력 항복 빼먹음', async () => {
    const response = await await request(server)
      .post('/api/auth/register')
      .send({ username: '양채훈', email: 'test@gmail.com' });
    expect(response.status).toBe(400);
  });
});
