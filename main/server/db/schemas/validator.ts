import Joi from 'joi';
import { IValidation, IDbOperationResult, IEes, IPublicHolidays } from '../actions/_types';

const schemaValidator = (schema: Joi.ObjectSchema, data: IEes | IPublicHolidays): IDbOperationResult => {
  if (schema && data) {
    const validationResult: IValidation = schema.validate(data);
    if (validationResult.error) {
      return { status: false, value: validationResult.error.message };
    }
    return { status: true, value: validationResult.value };
  }

  return { status: false, value: new Error(`Schema and/or data not found!`).message };
};

export default schemaValidator;
