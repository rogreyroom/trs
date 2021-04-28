import AsyncNedb from 'nedb-async';
import getDbConnection from '../connection';
import { IUser } from './_types';

const readDatabases = {
  GET_USER_BY_NAME: async (name: string): Promise<IUser> => {
    const usersDB: AsyncNedb<IUser> = await getDbConnection('users');
    const userData: IUser = await usersDB.asyncFindOne({ user: name });
    return userData;
  },
};

export default readDatabases;
