import * as path from 'path';
import { AsyncNedb } from 'nedb-async';

const isProd: boolean = process.env.NODE_ENV === 'production';
const isTest: boolean = process.env.NODE_ENV === 'test';
let dbDirectory: string;

if (isProd) {
  // Win portable directory
  const winPortablePath: string =
    process.env.PORTABLE_EXECUTABLE_DIR !== undefined ? process.env.PORTABLE_EXECUTABLE_DIR : '';
  dbDirectory = path.join(winPortablePath, '/db');
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

  return new AsyncNedb({
    filename: path.join(dbDirectory, dbName),
    autoload: true,
  });
};

export default getDbConnection;
