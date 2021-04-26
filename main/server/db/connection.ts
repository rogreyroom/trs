/* eslint-disable import/prefer-default-export */
import path from 'path';
import { AsyncNedb } from 'nedb-async';

const isProd: boolean = process.env.NODE_ENV === 'production';
const isTest: boolean = process.env.NODE_ENV === 'test';
let dbDirectory: string;

if (isProd) {
  // Win portable directory
  dbDirectory = path.join(process.env.PORTABLE_EXECUTABLE_DIR, '/db');
} else {
  dbDirectory = path.join(process.cwd(), 'resources/db');
}

// eslint-disable-next-line consistent-return
const getDbConnection = (name: string): AsyncNedb<unknown> => {
  let dbName: string;

  if (isTest) {
    dbName = `${name}.test.db`;
  } else {
    dbName = `${name}.db`;
  }

  switch (name) {
    case 'users':
      return new AsyncNedb({
        filename: path.join(dbDirectory, dbName),
        autoload: true,
      });
    default:
      break;
  }
};

export default getDbConnection;
