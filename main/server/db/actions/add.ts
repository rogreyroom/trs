import AsyncNedb from 'nedb-async';
import getDbConnection from '../connection';
import holidaysSchema from '../schemas/holidaysSchema';
import responsibilitiesSchema from '../schemas/responsibilitiesSchema';
import schemaValidator from '../schemas/validator';
import { IDbOperationResult, IEes, IEmployeesData, IPublicHolidays, IResponsibilities } from './_types';
import readDatabases from './read';
import { checkEesExist, checkEmployeeExist, checkHolidaysExist } from './utils';

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
    if (Object.keys(responsibilitiesData).length === 0 && responsibilitiesData.constructor === Object)
      return { status: false, value: `Data was not specify!` };
    const { employee } = responsibilitiesData;
    if (typeof employee === 'undefined') return { status: false, value: `Employee is required!` };

    const getResponsibilities = await readDatabases.GET_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID(employee);
    const responsibilitiesExists = getResponsibilities?.employee === employee;
    if (responsibilitiesExists) return { status: false, value: 'Data exist!' };

    const validation = schemaValidator(responsibilitiesSchema, responsibilitiesData);
    if (!validation.status) return { ...validation };

    const responsibilitiesDB: AsyncNedb<IResponsibilities> = await getDbConnection('responsibilities');
    const addResult = responsibilitiesDB && (await responsibilitiesDB.asyncInsert(responsibilitiesData));
    return addResult && { status: true, value: 'Adding successful!' };
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
