import Router from 'koa-router';
import auth from './auth';
import posts from './posts';
import list from './list';
import admin from './admin';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/posts', posts.routes());
api.use('/list', list.routes());
api.use('/admin', admin.routes());

api.get('/test', (ctx) => {
  ctx.body = '테스트';
});

export default api;
