import Joi from 'joi';
import {
  IValidation,
  IDbOperationResult,
  IEes,
  IPublicHolidays,
  IResponsibilities,
  IEmployeesData,
  IBasicEmployeeData,
  IMonthRates,
  IDateRange,
  ITrsData,
  IYearData,
} from '../actions/_types';

const schemaValidator = (
  schema: Joi.ObjectSchema,
  data:
    | IEes
    | IPublicHolidays
    | IResponsibilities
    | IEmployeesData
    | IBasicEmployeeData
    | IMonthRates
    | IDateRange
    | ITrsData
    | IYearData
): IDbOperationResult => {
  if (schema && data) {
    const validationResult: IValidation = schema.validate(data);
    if (validationResult.error) {
      return { status: false, message: validationResult.error.message };
    }
    return { status: true, message: 'Schema is OK!', value: validationResult.value };
  }

  return { status: false, message: new Error(`Schema and/or data not found!`).message };
};

export default schemaValidator;
