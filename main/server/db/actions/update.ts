import AsyncNedb from 'nedb-async';
import getDbConnection from '../connection';
import eesSchema from '../schemas/eesSchema';
import responsibilitiesSchema from '../schemas/responsibilitiesSchema';
import schemaValidator from '../schemas/validator';
import { IEes, IDbOperationResult, IResponsibilities } from './_types';
import readDatabases from './read';

const updateDatabases = {
  UPDATE_EES_DATA_BY_ID: async (id: string, data: IEes): Promise<IDbOperationResult> => {
    const eesDB: AsyncNedb<IEes> = await getDbConnection('ees');
    const validation = schemaValidator(eesSchema, data);

    if (!validation.status) return { ...validation };

    const updateResult = eesDB && (await eesDB.asyncUpdate({ _id: id }, { $set: { ...data } }));
    if (updateResult === 0) return { status: false, value: 'Update failed!' };
    return { status: true, value: 'Update successful!' };
  },

  UPDATE_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID: async (
    responsibilitiesData: IResponsibilities
  ): Promise<IDbOperationResult> => {
    if (Object.keys(responsibilitiesData).length === 0 && responsibilitiesData.constructor === Object)
      return { status: false, value: `Data was not specify!` };

    const { employee } = responsibilitiesData;
    if (typeof employee === 'undefined') return { status: false, value: `Employee is required!` };

    const getResponsibilities = await readDatabases.GET_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID(employee);
    const responsibilitiesExists = getResponsibilities?.employee === employee;
    if (!responsibilitiesExists) return { status: false, value: 'Employee data do not exist!' };

    const validation = schemaValidator(responsibilitiesSchema, responsibilitiesData);
    if (!validation.status) return { ...validation };

    const responsibilitiesDB: AsyncNedb<IResponsibilities> = await getDbConnection('responsibilities');
    const addResult =
      responsibilitiesDB && (await responsibilitiesDB.asyncUpdate({ employee }, { $set: { ...responsibilitiesData } }));
    return addResult && { status: true, value: 'Update successful!' };
  },
};

export default updateDatabases;
