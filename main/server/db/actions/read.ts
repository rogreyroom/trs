import AsyncNedb from 'nedb-async';
import getDbConnection from '../connection';

interface UserTypes {
  name: string;
  password: string;
  fullName: string;
  _id: string;
}

const readDatabases = {
  GET_USER_BY_NAME: async (name: string): Promise<UserTypes> => {
    const usersDB: AsyncNedb<unknown> = await getDbConnection('users');
    const userData: UserTypes = await usersDB.asyncFindOne({ user: name });
    return userData;
  },
};

export default readDatabases;
