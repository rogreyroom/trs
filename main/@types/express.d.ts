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
  IUser,
  IValidatorTestData,
} from '../server/db/actions/_types';

declare module 'express-serve-static-core' {
  interface Locals {
    validation?: {
      schema: Joi.ObjectSchema<any>;
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
        | IValidatorTestData;
    };
    validationResult?: {
      status: boolean;
      message: string;
      value?:
        | IEes
        | IUser
        | IPublicHolidays
        | IResponsibilities
        | IEmployeesData
        | IBasicEmployeeData
        | IValidatorTestData
        | number
        | null;
    };
  }
}
