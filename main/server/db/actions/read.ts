import AsyncNedb from 'nedb-async';
import getDbConnection from '../connection';
import { IUser, IEes, IPublicHolidays, IResponsibilities, IEmployeesData } from './_types';

const readDatabases = {
  GET_USER_BY_NAME: async (name: string): Promise<IUser> => {
    const usersDB: AsyncNedb<IUser> = await getDbConnection('users');
    const userData: IUser = await usersDB.asyncFindOne({ user: name });
    return userData;
  },

  GET_ALL_EES_DATA: async (): Promise<IEes[]> => {
    const eesDB: AsyncNedb<IEes> = await getDbConnection('ees');
    const eesData: IEes[] = await eesDB.asyncFind({});
    return eesData;
  },

  GET_EES_DATA_BY_SYMBOL: async (theSymbol: string): Promise<IEes> => {
    const eesDB: AsyncNedb<IEes> = await getDbConnection('ees');
    const eesData: IEes = await eesDB.asyncFindOne({ symbol: theSymbol });
    return eesData;
  },

  GET_PUBLIC_HOLIDAYS_DATA_BY_YEAR: async (theYear: number): Promise<IPublicHolidays> => {
    const holidaysDB: AsyncNedb<IPublicHolidays> = await getDbConnection('holidays');
    const holidaysData: IPublicHolidays = await holidaysDB.asyncFindOne({ year: theYear });
    return holidaysData;
  },

  GET_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID: async (employeeId: string): Promise<IResponsibilities> => {
    const responsibilitiesDB: AsyncNedb<IResponsibilities> = await getDbConnection('responsibilities');
    const responsibilitiesData: IResponsibilities = await responsibilitiesDB.asyncFindOne({ employee: employeeId });
    return responsibilitiesData;
  },

  GET_ALL_EMPLOYEES_DATA: async (): Promise<IEmployeesData[]> => {
    const employeesDB: AsyncNedb<IEmployeesData> = await getDbConnection('employees');
    const employeesData: IEmployeesData[] = await employeesDB.asyncFind({});
    return employeesData;
  },

  GET_EMPLOYEE_DATA_BY_ID: async (id: string): Promise<IEmployeesData> => {
    const employeesDB: AsyncNedb<IEmployeesData> = await getDbConnection('employees');
    const employeeData: IEmployeesData = await employeesDB.asyncFindOne({ _id: id });
    return employeeData;
  },

  GET_EMPLOYEE_DATA_BY_NAME: async (theName: string, theSurname: string): Promise<IEmployeesData> => {
    const employeesDB: AsyncNedb<IEmployeesData> = await getDbConnection('employees');
    const employeeData: IEmployeesData = await employeesDB.asyncFindOne({ name: theName, surname: theSurname });
    return employeeData;
  },
};

export default readDatabases;
