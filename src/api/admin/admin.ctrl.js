import Joi from 'joi';
import Admin from '../../models/admin';
import User from '../../models/users';

export const register = async (ctx) => {
  const schema = Joi.object().keys({
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body;
  try {
    const exists = await Admin.findByUsername(username);
    if (exists) {
      ctx.status = 409;
      return;
    }

    const admin = new Admin({ username });
    await admin.setPassword(password);
    await admin.save();

    ctx.body = admin.serialize();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const login = async (ctx) => {
  const { username, password } = ctx.request.body;
  if (!username || !password) {
    ctx.status = 401;
    return;
  }

  try {
    const admin = await Admin.findByUsername(username);
    if (!admin) {
      ctx.status = 401;
      return;
    }

    const valid = await admin.checkPassword(password);
    if (!valid) {
      ctx.status = 401;
      return;
    }

    ctx.body = admin.serialize();

    const token = admin.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const getUserList = async (ctx) => {
  const user = await User.find({});

  ctx.body = user;

  return;
};

export const deleteUser = async (ctx) => {
  const schema = Joi.object().keys({
    username: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username } = ctx.request.body;

  try {
    await User.deleteOne({ username }, (err) => {
      if (err) {
        ctx.status = 400;
        ctx.body = err;

        return;
      }
    });

    ctx.status = 204;

    return;
  } catch (e) {
    ctx.throw(500, e);
  }
};
