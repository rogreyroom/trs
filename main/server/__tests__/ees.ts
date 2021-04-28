import { IEes } from '../db/actions/_types';
import readDatabases from '../db/actions/read';

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

describe('Find all ees data', () => {
  it('should be empty array if ees data do not exist', async () => {
    const eesData: IEes[] = await readDatabases.GET_ALL_EES_DATA();
    expect(eesData).toEqual([]);
  });

  it('should return array of objects if ees data exist', async () => {
    const eesData: IEes[] = await readDatabases.GET_ALL_EES_DATA();
    expect(eesData.length).toBeGreaterThan(0);
  });
});

describe('Find ees data by ees id', () => {
  it('it should be null if ees do not exist', async () => {
    const firstEesDataId = '0';
    const singleEesData: IEes = await readDatabases.GET_EES_DATA_BY_ID(firstEesDataId);
    expect(singleEesData).toBeNull();
  });

  it('should return first object from database', async () => {
    const eesData: IEes[] = await readDatabases.GET_ALL_EES_DATA();
    // eslint-disable-next-line no-underscore-dangle
    const firstEesDataId = eesData[0]?._id;

    const singleEesData: IEes = await readDatabases.GET_EES_DATA_BY_ID(firstEesDataId);
    expect(singleEesData).not.toBeNull();
    expect(singleEesData).toEqual(expect.objectContaining({ _id: firstEesDataId }));
  });
});
