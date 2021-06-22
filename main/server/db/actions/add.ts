import AsyncNedb from 'nedb-async';
import getDbConnection from '../connection';
import { IDbOperationResult, IEes, IEmployeesData, IPublicHolidays, IResponsibilities } from './_types';
import { checkEesExist, checkEmployeeExist, checkHolidaysExist, checkResponsibilitiesExist } from './utils';

const addDatabases = {
  ADD_EES_DATA: async (eesData: IEes): Promise<IDbOperationResult> => {
    const { symbol } = eesData;
    const checkEes = await checkEesExist({ symbol });
    if (checkEes.status) return checkEes;

    const eesDB: AsyncNedb<IEes> = await getDbConnection('ees');
    const addResult = eesDB && (await eesDB.asyncInsert(eesData));
    return addResult && { status: true, message: 'The ees data was added!', value: addResult };
  },

  ADD_PUBLIC_HOLIDAYS_DATA: async (holidaysData: IPublicHolidays): Promise<IDbOperationResult> => {
    const { year } = holidaysData;
    const checkHolidays = await checkHolidaysExist(year);
    if (checkHolidays.status) return checkHolidays;

    const holidaysDB: AsyncNedb<IPublicHolidays> = await getDbConnection('holidays');
    const addResult = holidaysDB && (await holidaysDB.asyncInsert(holidaysData));
    return addResult && { status: true, message: 'The public holidays were added!', value: addResult };
  },

  ADD_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID: async (
    responsibilitiesData: IResponsibilities
  ): Promise<IDbOperationResult> => {
    const { employee } = responsibilitiesData;
    const checkResponsibilities = await checkResponsibilitiesExist(employee);
    if (checkResponsibilities.status) return checkResponsibilities;

    const responsibilitiesDB: AsyncNedb<IResponsibilities> = await getDbConnection('responsibilities');
    const addResult = responsibilitiesDB && (await responsibilitiesDB.asyncInsert(responsibilitiesData));
    return addResult && { status: true, message: 'The responsibilities data was added!', value: addResult };
  },

  ADD_EMPLOYEE_DATA: async (employeeData: IEmployeesData): Promise<IDbOperationResult> => {
    const { name, surname } = employeeData;
    const checkEmployee = await checkEmployeeExist({ name, surname });
    if (checkEmployee.status) return checkEmployee;

    const employeesDB: AsyncNedb<IEmployeesData> = await getDbConnection('employees');
    const addResult = employeesDB && (await employeesDB.asyncInsert(employeeData));
    return addResult && { status: true, message: 'The employee was added!', value: addResult };
  },
};

export default addDatabases;
