import Joi from 'joi';

export const dateSchema = Joi.object().keys({
  day: Joi.number().required().error(new Error(`Day is required and should be a number!`)),
  month: Joi.number().required().error(new Error(`Month is required and should be a number!`)),
  year: Joi.number().required().error(new Error(`Year is required and should be a number!`)),
});

export const dateRangeSchema = Joi.object().keys({
  from: dateSchema.required(),
  to: dateSchema.required(),
});

export const evaluationSchema = Joi.object().keys({
  name: Joi.string().required().error(new Error(`Evaluation name is required and should be a string!`)),
  description: Joi.string().required().error(new Error(`Evaluation description is required and should be a string!`)),
  percent: Joi.number().required().error(new Error(`Evaluation percent is required and should be a number!`)),
});

export const rtsSchema = Joi.object().keys({
  workingHours: Joi.number().required().error(new Error(`Working hours is required and should be a number!`)),
  overtimeHours: Joi.number().required().error(new Error(`Overtime hours is required and should be a number!`)),
  weekendHours: Joi.number().required().error(new Error(`Weekend hours is required and should be a number!`)),
  dueDate: dateSchema.required(),
  evaluation: Joi.array().items(evaluationSchema),
});

export const monthRatesSchema = Joi.object().keys({
  month: Joi.number().required().error(new Error(`Month is required and should be a number!`)),
  hourlyRate: Joi.number().required().error(new Error(`Hourly rate is required and should be a number!`)),
  overtimeRate: Joi.number().required().error(new Error(`Overtime rate is required and should be a number!`)),
  holidayRate: Joi.number().required().error(new Error(`Holiday rate is required and should be a number!`)),
  sickLeaveRate: Joi.number().required().error(new Error(`Sick leave rate is required and should be a number!`)),
  otherLeaveRate: Joi.number().required().error(new Error(`Other leave rate is required and should be a number!`)),
  insuranceRate: Joi.number().required().error(new Error(`Insurance rate is required and should be a number!`)),
  retainmentRate: Joi.number().required().error(new Error(`Retainment rate is required and should be a number!`)),
  bonusRate: Joi.number().required().error(new Error(`Bonus rate is required and should be a number!`)),
  toAccountRate: Joi.number().required().error(new Error(`To account rate is required and should be a number!`)),
  overtimeRateMultiplier: Joi.number()
    .required()
    .error(new Error(`Overtime rate multiplier is required and should be a number!`)),
  overtimeHoursMultiplier: Joi.number()
    .required()
    .error(new Error(`Overtime hours multiplier is required and should be a number!`)),
});

export const monthSchema = monthRatesSchema.keys({
  holidayLeave: Joi.array().items(dateRangeSchema),
  sickLeave: Joi.array().items(dateRangeSchema),
  otherLeave: Joi.array().items(dateRangeSchema),
  rts: Joi.array().items(rtsSchema),
});

export const yearSchema = Joi.object().keys({
  year: Joi.number().required().error(new Error(`Year is required and should be a number!`)),
  months: Joi.array().items(monthSchema),
});

export const basicEmployeeSchema = Joi.object().keys({
  doc: Joi.string().required().error(new Error(`Doc name is required`)),
  name: Joi.string().required().error(new Error(`Name is required and should be a string!`)),
  surname: Joi.string().required().error(new Error(`Surname is required and should be a string!`)),
  position: Joi.string().required().error(new Error(`Position is required and should be a string!`)),
  juvenileWorker: Joi.boolean().required().error(new Error(`Juvenile worker is required and should be a boolean!`)),
  employmentStatus: Joi.boolean().required().error(new Error(`Employment status is required and should be a boolean!`)),
  overdueLeaveAmount: Joi.number().required().error(new Error(`Overdue leave is required and should be a number!`)),
  assignedLeaveAmount: Joi.number().required().error(new Error(`Assigned leave is required and should be a number!`)),
  employmentStartDate: dateSchema.required(),
  employmentTerminationDate: dateSchema.allow(null),
});

const employeesSchema = basicEmployeeSchema.keys({
  calendar: Joi.array().items(yearSchema),
});

export default employeesSchema;
