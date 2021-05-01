import AsyncNedb from 'nedb-async';
import getDbConnection from '../connection';
import holidaysSchema from '../schemas/holidaysSchema';
import schemaValidator from '../schemas/validator';
import { IDbOperationResult, IPublicHolidays } from './_types';
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
};

export default addDatabases;
