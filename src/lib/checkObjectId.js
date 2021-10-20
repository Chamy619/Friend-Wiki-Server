import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  return next();
};

export default checkObjectId;
