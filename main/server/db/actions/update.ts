import AsyncNedb from 'nedb-async';
import getDbConnection from '../connection';
import eesSchema from '../schemas/eesSchema';
import schemaValidator from '../schemas/validator';
import { IEes, IDbOperationResult } from './_types';

const updateDatabases = {
  UPDATE_EES_DATA_BY_ID: async (id: string, data: IEes): Promise<IDbOperationResult> => {
    const eesDB: AsyncNedb<IEes> = await getDbConnection('ees');
    const validation = schemaValidator(eesSchema, data);

    if (!validation.status) return { ...validation };

    const updateResult = eesDB && (await eesDB.asyncUpdate({ _id: id }, { $set: { ...data } }));
    if (updateResult === 0) return { status: false, value: 'Update failed!' };
    return { status: true, value: 'Update successful!' };
  },
};

export default updateDatabases;
