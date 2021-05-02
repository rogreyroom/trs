import Joi from 'joi';

const responsibilitiesSchema = Joi.object().keys({
  doc: Joi.string().required().error(new Error(`Doc name is required`)),
  employee: Joi.string().required().error(new Error(`Employee ID is required and should be a string!`)),
  text: Joi.string().required().error(new Error(`Responsibilities text is required and should be a string!`)),
});

export default responsibilitiesSchema;
