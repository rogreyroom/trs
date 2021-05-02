import { IResponsibilities } from '../db/actions/_types';
import addDatabases from '../db/actions/add';
import readDatabases from '../db/actions/read';
import updateDatabases from '../db/actions/update';

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

describe('Find responsibilities for given employee id', () => {
  it('should return empty object if responsibilities for given employee id do not exist', async () => {
    const responsibilitiesData = await readDatabases.GET_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID('1');
    expect(responsibilitiesData).toBeNull();
    expect(responsibilitiesData).not.toEqual(expect.objectContaining({ employee: '1' }));
  });

  it('should return object with data if responsibilities for given employee id exist', async () => {
    const responsibilitiesData = await readDatabases.GET_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID('10');
    expect(responsibilitiesData.employee).toEqual('10');
    expect(responsibilitiesData).toEqual(expect.objectContaining({ employee: '10' }));
  });
});

describe('Add responsibilities for given employee id', () => {
  const dummyData: IResponsibilities = {
    doc: 'responsibilities',
    employee: '10',
    text:
      'Zakres obowiązków pracownika biurowego\n\n• zajmowanie się dokumentacją, korespondencją oraz prowadzenie terminarza.',
  };

  it('should return status: false and value: Data was not specify!', async () => {
    const result = await addDatabases.ADD_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID({});
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual('Data was not specify!');
  });

  it('should return status: false and value: Employee is required!', async () => {
    const result = await addDatabases.ADD_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID({ doc: 'responsibilities' });
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual('Employee is required!');
  });
  it('should return status: false and validation error value: Doc name is required', async () => {
    const result = await addDatabases.ADD_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID({
      employee: '1',
      text: 'Some dummy data',
    });
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual('Doc name is required');
  });
  it('should add responsibilities data and return status: true and value: Adding successful!', async () => {
    const result = await addDatabases.ADD_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID(dummyData);
    console.log('result', result);
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual('Adding successful!');
  });
  it('should return status: false and value Data exist! when data for given employee exist in database', async () => {
    const result = await addDatabases.ADD_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID(dummyData);
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual('Data exist!');
  });
});

describe('Update responsibilities for given employee id', () => {
  const dummyData: IResponsibilities = {
    doc: 'responsibilities',
    employee: '10',
    text: 'Zakres obowiązków Kierownika.',
  };

  it('should return status: false and value: Data was not specify!', async () => {
    const result = await updateDatabases.UPDATE_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID({});
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual('Data was not specify!');
  });

  it('should return status: false and value: Employee is required', async () => {
    const result = await updateDatabases.UPDATE_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID({ doc: 'responsibilities' });
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual('Employee is required!');
  });
  it('should return status: false when data for given employee do not exist in database and value: Employee data do not exist!', async () => {
    const result = await updateDatabases.UPDATE_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID(dummyData);
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual('Employee data do not exist!');
  });
  it('should return status: false and validation error value: Doc name is required', async () => {
    const result = await updateDatabases.UPDATE_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID({
      employee: '10',
      text: 'Some dummy data',
    });
    expect(result.status).toBeFalsy();
    expect(result.value).toEqual('Doc name is required');
  });

  it('should update responsibilities data and return status: true and value: Update successful!', async () => {
    const result = await updateDatabases.UPDATE_RESPONSIBILITIES_DATA_BY_EMPLOYEE_ID(dummyData);
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual('Update successful!');
  });
});
