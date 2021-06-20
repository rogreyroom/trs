export interface IUser {
  doc: string;
  user: string;
  passwordHash: string;
  fullName: string;
  _id: string;
}
export interface IEes {
  doc: string;
  type: string;
  countType: string;
  symbol: string;
  percent: string;
  description: string;
  _id?: string;
}

export interface IValidation {
  value?: IEes;
  error?: Error;
}

export interface IDbOperationResult {
  status: boolean;
  message: string;
  value?: IEes | IUser | IPublicHolidays | IResponsibilities | IEmployeesData | IBasicEmployeeData | number | null;
}

export interface IPublicHolidaysItem {
  year: number;
  month: number;
  day: number;
  name: string;
}

export interface IPublicHolidays {
  doc: string;
  year: number;
  publicHolidays: Array<IPublicHolidaysItem>;
  _id?: string;
}

export interface IResponsibilities {
  doc: string;
  employee: string;
  text: string;
  _id?: string;
}

export interface IDate {
  day: number;
  month: number;
  year: number;
}

export interface IDateRange {
  from: IDate;
  to: IDate;
}

export interface IEvaluationData {
  name: string;
  description: string;
  percent: number;
}

export interface ITrsData {
  workingHours: number;
  overtimeHours: number;
  weekendHours: number;
  dueDate: IDate;
  evaluation: IEvaluationData[] | [];
}

export interface IMonthRates {
  month: number;
  hourlyRate: number;
  overtimeRate: number;
  holidayRate: number;
  sickLeaveRate: number;
  otherLeaveRate: number;
  insuranceRate: number;
  retainmentRate: number;
  bonusRate: number;
  toAccountRate: number;
  overtimeRateMultiplier: number;
  overtimeHoursMultiplier: number;
}

export interface IMonthData extends IMonthRates {
  holidayLeave: IDateRange[] | [];
  sickLeave: IDateRange[] | [];
  otherLeave: IDateRange[] | [];
  rts: ITrsData[] | [];
}

export interface IYearData {
  year: number;
  months: IMonthData[];
}

export interface IBasicEmployeeData {
  doc: string;
  name: string;
  surname: string;
  position: string;
  juvenileWorker: boolean;
  employmentStatus: boolean;
  overdueLeaveAmount: number;
  assignedLeaveAmount: number;
  employmentStartDate: IDate;
  employmentTerminationDate: IDate | null;
  _id?: string;
}

export interface IEmployeesData extends IBasicEmployeeData {
  calendar: IYearData[];
}

export interface IQueryFields {
  name: string;
  year: number;
  month: number;
}

export interface IValidatorTestData {
  doc: string;
  type: string;
  symbol: string;
}
