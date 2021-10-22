import Joi from 'joi';
import Genealogy from '../../models/genealogy';

export const getGenealogy = async (ctx) => {
  const genealogy = await Genealogy.find({});

  ctx.body = genealogy;

  return;
};

export const write = async (ctx) => {
  const schema = Joi.object().keys({
    name: Joi.string().allow(''),
    date: Joi.string().required(),
    description: Joi.string(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { name, date, description } = ctx.request.body;
  try {
    const genealogy = new Genealogy({ name, date, description });
    await genealogy.save();

    ctx.body = genealogy;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const readOne = async (ctx) => {
  const { id } = ctx.params;

  try {
    const one = await Genealogy.findById(id).exec();
    if (!one) {
      ctx.status = 404;
      return;
    }
    ctx.body = one;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const update = async (ctx) => {
  const { id } = ctx.params;

  const schema = Joi.object().keys({
    name: Joi.string(),
    date: Joi.string(),
    description: Joi.string(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const updateGenealogy = {
    ...ctx.request.body,
  };

  try {
    const target = await Genealogy.findByIdAndUpdate(id, updateGenealogy, { new: true }).exec();
    ctx.body = target;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const remove = async (ctx) => {
  const { id } = ctx.params;
  console.log('들어옴?');
  try {
    await Genealogy.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};
