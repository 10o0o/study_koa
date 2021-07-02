const Joi = require('joi');
const { Types: { ObjectId } } = require('mongoose');

const ObjectId = require('mongoose').Types.ObjectId;

exports.replace = async (ctx) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    ctx.body = {
      message: '유효하지 않은 ID',
      data: null,
    }
    return;
  }

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    authors: Joi.array().items(Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required()
    })),
    publishedDate: Joi.date().required(),
    tags: Joi.array().items((Joi.string()).required())
  });

  const result = Joi.validate(ctx.requeset.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
}