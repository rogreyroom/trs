import Joi from 'joi';
import {
  IEes,
  IPublicHolidays,
  IResponsibilities,
  IEmployeesData,
  IBasicEmployeeData,
  IMonthRates,
  IDateRange,
  ITrsData,
  IYearData,
} from '../../main/server/db/actions/_types';

interface IValidatorTest {
  doc: string;
  type: string;
  symbol: string;
}

interface IValidator {
  data:
    | IEes
    | IPublicHolidays
    | IResponsibilities
    | IEmployeesData
    | IBasicEmployeeData
    | IMonthRates
    | IDateRange
    | ITrsData
    | IYearData;
  schema: Joi.ObjectSchema<unknown>;
}

declare global {
  namespace Express {
    interface Request {
      validation?: IValidator;
    }
    interface Response {
      validation?: IValidator;
    }
  }
}
