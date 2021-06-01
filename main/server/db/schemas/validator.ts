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

const schemaValidator = async (
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
): Promise<IDbOperationResult> => {
  if (schema && data) {
    const validationResult: IValidation = await schema.validate(data);
    if (validationResult.error) {
      return { status: false, message: validationResult.error.message };
    }
    return { status: true, message: 'Schema is OK!', value: validationResult.value };
  }

  return { status: false, message: new Error(`Schema and/or data not found!`).message };
};

export default schemaValidator;
