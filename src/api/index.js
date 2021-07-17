import Router from 'koa-router';

const api = new Router();
api.get('/test', (ctx) => {
  ctx.body = '테스트';
});

export default api;
