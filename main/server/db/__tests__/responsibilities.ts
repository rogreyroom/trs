import AsyncNedb from 'nedb-async';
import { IResponsibilities } from '../actions/_types';
import addDatabases from '../actions/add';
import readDatabases from '../actions/read';
import updateDatabases from '../actions/update';
import getDbConnection from '../connection';

beforeAll(async () => {
  const responsibilitiesDB: AsyncNedb<IResponsibilities> = await getDbConnection('responsibilities');
  await responsibilitiesDB.asyncRemove({}, { multi: true });
});

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

const randomEmployeeId = Math.random().toString();
// ADD
describe('Adding a new employee responsibilities', () => {
  const addResponsibilitiesData: IResponsibilities = {
    doc: 'responsibilities',
    employee: randomEmployeeId,
    text:
      'Zakres obowiązków pracownika biurowego\n\n• zajmowanie się dokumentacją, korespondencją oraz prowadzenie terminarza.',
  };

  it('it should be successful if responsibilities for given employee does not exists and new responsibilities ware added to DB', async () => {
    const result = await addDatabases.ADD_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID(addResponsibilitiesData);
    expect(result.message).toEqual('The responsibilities data was added!');
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(expect.objectContaining({ employee: randomEmployeeId }));
  });
});

// FIND
describe('Finding employee responsibilities)', () => {
  const responsibilitiesEmployeeId = randomEmployeeId;

  it('it should be successful if responsibilitiesData object has doc key equal "responsibilities" and employee equal "responsibilitiesEmployeeId"', async () => {
    const responsibilitiesData = await readDatabases.GET_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID(
      responsibilitiesEmployeeId
    );
    expect(responsibilitiesData).toEqual(expect.objectContaining({ doc: 'responsibilities' }));
    expect(responsibilitiesData).toEqual(expect.objectContaining({ employee: randomEmployeeId }));
  });
});

// UPDATE
describe('Updating employee responsibilities', () => {
  const truthyEesId = randomEmployeeId;
  const falsyEesId = '333';
  const updatedResponsibilitiesData: IResponsibilities = {
    doc: 'responsibilities',
    employee: randomEmployeeId,
    text:
      'Zakres obowiązków pracownika biurowego\n\n• zajmowanie się dokumentacją, korespondencją oraz prowadzenie terminarza.',
  };

  it('it should be successful if given responsibilities exists and responsibilities data was updated', async () => {
    const result = await updateDatabases.UPDATE_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID({
      ...updatedResponsibilitiesData,
      employee: truthyEesId,
    });
    expect(result.message).toEqual('The responsibilities data ware updated!');
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(1);
  });

  it('it should be unsuccessful if given employee does not exists and responsibilities data was not updated', async () => {
    const result = await updateDatabases.UPDATE_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID({
      ...updatedResponsibilitiesData,
      employee: falsyEesId,
    });
    expect(result.message).toEqual('The responsibilities for the given employee does not exist!');
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual(null);
  });
});
