import Joi from 'joi';

const eesSchema = Joi.object().keys({
  doc: Joi.string().required().error(new Error(`Doc name is required`)),
  type: Joi.string().required().error(new Error(`Type is required and should be a string!`)),
  countType: Joi.string()
    .valid('auto', 'manual')
    .required()
    .error(new Error(`Count type is required and should be a string`)),
  symbol: Joi.string().required().error(new Error(`Symbol is required and should be a string`)),
  percent: Joi.number().required().error(new Error(`Percent is required and should be a string`)),
  description: Joi.string().required().error(new Error(`Description is required and should be a string`)),
});

export default eesSchema;
