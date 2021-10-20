import Joi from 'joi';
import Genealogy from '../../models/genealogy';

export const getGenealogy = async (ctx) => {
  const genealogy = await Genealogy.find({});

  ctx.body = genealogy;

  return;
};

export const write = async (ctx) => {
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

  const { name, date, description } = ctx.request.body;
  try {
    const genealogy = new Genealogy({ name, date, description });
    await genealogy.save();

    ctx.body = genealogy;
  } catch (e) {
    ctx.throw(500, e);
  }
};
