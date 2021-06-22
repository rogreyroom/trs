import Joi from 'joi';

const holidaysSchema = Joi.object().keys({
  doc: Joi.string().required().error(new Error(`Doc name is required`)),
  year: Joi.number().required().error(new Error(`Year is required and should be a number!`)),
  publicHolidays: Joi.array().items(
    Joi.object().keys({
      year: Joi.number().required().error(new Error(`Year is required and should be a number!`)),
      month: Joi.number().required().error(new Error(`Month is required and should be a number!`)),
      day: Joi.number().required().error(new Error(`Day is required and should be a number!`)),
      name: Joi.string().required().error(new Error(`Holiday name is required and should be a string!`)),
    })
  ),
});

export default holidaysSchema;
