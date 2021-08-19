import mongoose from 'mongoose';
import Joi from 'joi';
import Post from '../../models/post';

const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }
  return next();
};

/**
 * 포스트 작성
 * POST /api/posts
 * @param {title, body}: {string, string} 형태가 request.body 에 존재해야 함.
 */
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body } = ctx.request.body;
  const post = new Post({ title, body });

  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * 포스트 목록 조회
 * GET /api/posts
 * @param {}
 */
export const list = async (ctx) => {
  try {
    const posts = await Post.find().exec();
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * 특정 포스트 조회
 * GET /api/posts/:id
 * @param {}
 */
export const read = async (ctx) => {
  const { id } = ctx.params;

  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**
 * 특정 포스트 제거
 * DELETE /api/posts/:id
 * @param {}
 */
export const remove = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

// /**
//  * 포스트 수정(교체)
//  * PUT /api/posts/:id
//  * @param {title, body}: {string, string} 형태가 request.body 에 존재해야 함
//  */
// export const replace = (ctx) => {
//   const { id } = ctx.params;
//   const index = posts.findeIndex((post) => post.id.toString() === id);

//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }

//   posts[index] = {
//     id,
//     title: ctx.request.body.title,
//     body: ctx.request.body.body,
//   };
//   ctx.body = posts[index];
// };

/**
 * 포스트 수정(일부분)
 * PATCH /api/posts/:id
 * @param {title, body}: {string, string} 형태가 request.body 안에 존재해야 하는데, 둘 중 하나만 존재해도 됨.
 */
export const update = async (ctx) => {
  const { id } = ctx.params;

  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();
    ctx.body = post;
  } catch (e) {
    throw (500, e);
  }
};
