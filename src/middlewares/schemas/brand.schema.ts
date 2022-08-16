import Joi from 'joi';

const id = Joi.string();
const name = Joi.string();
const isParent = Joi.bool();
const parent = Joi.string();
const parentBrands = Joi.bool();

const schemas = {
  createBrand: Joi.object({
    name: name.required(),
    isParent: isParent.required(),
    parent: parent.optional(),
  }),
  getBrands: Joi.object({
    parentBrands: parentBrands.optional(),
  }),
  editById: Joi.object({
    id: id.required(),
    name: name.required(),
  }),
};

export default schemas;
