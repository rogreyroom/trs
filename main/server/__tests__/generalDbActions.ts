import { AsyncNedb } from 'nedb-async';
import getDbConnection from '../db/connection';

const db: AsyncNedb<unknown> = getDbConnection('users');

interface DataType {
  doc?: string;
  user?: string;
  passwordHash?: string;
  fullName?: string;
}
interface RecordType extends DataType {
  _id: string;
}

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

describe('When calling DB for the first time', () => {
  test('db should be available', () => {
    expect(db).not.toBeUndefined();
  });

  it('should return 0 records', async () => {
    const records: RecordType[] = await db.asyncFind({});
    expect(records.length).not.toBeGreaterThan(0);
  });
});

describe('When calling DB for the second and more times', () => {
  it('should return more then 0 records', async () => {
    const records: RecordType[] = await db.asyncFind({});
    expect(records.length).toBeGreaterThan(0);
  });
});

describe('Inserting records', () => {
  const dummyData: DataType = { doc: 'users', user: 'test', fullName: 'test name', passwordHash: 'passwordStringHash' };

  it('should add 1 record with dummyData', async () => {
    await db.asyncInsert(dummyData);
    const records: RecordType[] = await db.asyncFind({});
    expect(records.length).toBeGreaterThan(0);
  });

  it('should have generated _id', async () => {
    const records: RecordType[] = await db.asyncFind({});
    const lastRecord: number = records.length - 1;
    // eslint-disable-next-line no-underscore-dangle
    expect(records[lastRecord]._id).toEqual(expect.stringMatching(/^[a-zA-Z0-9~@#$%^&*]/));
  });

  it('should have user equal to "test" on last record', async () => {
    const records: RecordType[] = await db.asyncFind({});
    const lastRecord: number = records.length - 1;
    expect(records[lastRecord].user).toEqual('test');
  });
});

describe('Finding records', () => {
  let records: RecordType[];
  let firstRecordId: string;
  let firstRecordObject: RecordType;

  beforeEach(async () => {
    records = await db.asyncFind({});
    // eslint-disable-next-line no-underscore-dangle
    firstRecordId = records[0]._id;
    [firstRecordObject] = records;
  });

  it('should find the first record object', async () => {
    const foundObjectById: RecordType = await db.asyncFindOne({ _id: firstRecordId });
    expect(foundObjectById).toMatchObject(firstRecordObject);
  });

  it('should return all records and ba an array', () => {
    expect(records.length).toBeGreaterThan(0);
    expect(records).toEqual(expect.arrayContaining([]));
  });
});

describe('Updating records', () => {
  const newData: DataType = {
    user: 'updated test',
    fullName: 'updated test name',
    passwordHash: 'passwordStringHash',
  };

  it('should update first record', async () => {
    const records: RecordType[] = await db.asyncFind({});
    // eslint-disable-next-line no-underscore-dangle
    const firstRecordId: string = records[0]._id;
    await db.asyncUpdate({ _id: firstRecordId }, { $set: { ...newData } });
    const updatedRecord: RecordType = await db.asyncFindOne({ _id: firstRecordId });

    expect(updatedRecord).toMatchObject({ doc: 'users', ...newData, _id: firstRecordId });
  });
});
