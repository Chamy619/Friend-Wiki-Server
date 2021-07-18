import request from 'supertest';
import server from './main';
import { test } from '@jest/globals';

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
