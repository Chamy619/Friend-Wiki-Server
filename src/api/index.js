import Router from 'koa-router';
import auth from './auth';
import posts from './posts';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/posts', posts.routes());

api.get('/test', (ctx) => {
  ctx.body = '테스트';
});

export default api;
