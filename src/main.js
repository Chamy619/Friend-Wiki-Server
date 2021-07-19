import dotenv from 'dotenv';
import Koa from 'koa';
import Router from 'koa-router';
import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import api from './api';

dotenv.config();

const { PORT, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((e) => {
    console.error(e);
  });

const app = new Koa();
app.use(bodyParser());

const router = new Router();
router.use('/api', api.routes());
app.use(router.routes()).use(router.allowedMethods());

app.use((ctx) => {
  ctx.body = 'hello world';
});

const port = PORT || 4000;

const server = app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

export default server;
