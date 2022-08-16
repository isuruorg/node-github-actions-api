import Joi from 'joi';

const skip = Joi.number();
const limit = Joi.number();
const chain = Joi.string();

const schemas = {
  importCSV: Joi.object({
    headers: Joi.object({
      'content-type': Joi.string().valid('csv').required(),
    }),
  }),
  defaultQuery: Joi.object({
    skip: skip.optional(),
    limit: limit.optional(),
  }),
  getStoresByChain: Joi.object({
    chain: chain.required(),
    skip: skip.optional(),
    limit: limit.optional(),
  }),
};

export default schemas;
