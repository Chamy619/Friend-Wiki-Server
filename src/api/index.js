import Router from 'koa-router';
import auth from './auth';

const api = new Router();

api.use('/auth', auth.routes());

api.get('/test', (ctx) => {
  ctx.body = '테스트';
});

export default api;
