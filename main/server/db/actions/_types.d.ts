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
  value: IEes | string;
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
