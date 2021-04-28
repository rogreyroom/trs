import AsyncNedb from 'nedb-async';
import getDbConnection from '../connection';
import { IUser, IEes } from './_types';

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

  GET_EES_DATA_BY_ID: async (id: string): Promise<IEes> => {
    const eesDB: AsyncNedb<IEes> = await getDbConnection('ees');
    const eesData: IEes = await eesDB.asyncFindOne({ _id: id });
    return eesData;
  },
};

export default readDatabases;
