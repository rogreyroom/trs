import AsyncNedb from 'nedb-async';
import getDbConnection from '../connection';
import holidaysSchema from '../schemas/holidaysSchema';
import responsibilitiesSchema from '../schemas/responsibilitiesSchema';
import schemaValidator from '../schemas/validator';
import { IDbOperationResult, IPublicHolidays, IResponsibilities } from './_types';
import readDatabases from './read';

const addDatabases = {
  ADD_PUBLIC_HOLIDAYS_DATA: async (holidaysData: IPublicHolidays): Promise<IDbOperationResult> => {
    const { year } = holidaysData;
    if (typeof year === 'undefined') return { status: false, value: `Year was not specify!` };

    const getYear = await readDatabases.GET_PUBLIC_HOLIDAYS_DATA_BY_YEAR(year);
    const yearExists = getYear?.year === year;
    if (yearExists) return { status: false, value: `Data for year: ${year} already exist!` };

    const validation = schemaValidator(holidaysSchema, holidaysData);
    if (!validation.status) return { ...validation };
    const holidaysDB: AsyncNedb<IPublicHolidays> = await getDbConnection('holidays');
    const addResult = holidaysDB && (await holidaysDB.asyncInsert(holidaysData));
    return addResult && { status: true, value: 'Adding successful!' };
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
};

export default addDatabases;
