import AsyncNedb from 'nedb-async';
import {
  IBasicEmployeeData,
  IDateRange,
  IEmployeesData,
  IMonthRates,
  IQueryFields,
  ITrsData,
} from '../db/actions/_types';
import addDatabases from '../db/actions/add';
import readDatabases from '../db/actions/read';
import updateDatabases from '../db/actions/update';
import getDbConnection from '../db/connection';

beforeAll(async () => {
  const employeesDB: AsyncNedb<IEmployeesData> = await getDbConnection('employees');
  await employeesDB.asyncRemove({}, { multi: true });
});

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

// ADD
describe('Adding a new employee', () => {
  const newEmployee: IEmployeesData = {
    _id: '111',
    doc: 'employee',
    name: 'John',
    surname: 'Doe',
    position: 'Kat',
    juvenileWorker: false,
    employmentStatus: true,
    overdueLeaveAmount: 5,
    assignedLeaveAmount: 26,
    employmentStartDate: { day: 1, month: 1, year: 2015 },
    employmentTerminationDate: null,
    calendar: [
      {
        year: 2021,
        months: [
          {
            month: 1,
            hourlyRate: 1,
            overtimeRate: 1,
            holidayRate: 1,
            sickLeaveRate: 1,
            otherLeaveRate: 1,
            insuranceRate: 1,
            retainmentRate: 1,
            bonusRate: 1,
            toAccountRate: 1,
            overtimeRateMultiplier: 1,
            overtimeHoursMultiplier: 1,
            holidayLeave: [],
            sickLeave: [],
            otherLeave: [],
            rts: [],
          },
        ],
      },
    ],
  };

  it('it should be successful if employee does not exists and new employee was added to DB', async () => {
    const result = await addDatabases.ADD_EMPLOYEE_DATA(newEmployee);
    expect(result.message).toEqual('The employee was added!');
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(expect.objectContaining({ _id: '111' }));
  });
});

// FIND
describe('Finding employees', () => {
  const employeeId = '111';
  const theName = 'John';
  const theSurname = 'Doe';

  it('it should be successful if result array length is greater than 0', async () => {
    const employeesArray = await readDatabases.GET_ALL_EMPLOYEES_DATA();
    expect(employeesArray.length).toBeGreaterThan(0);
  });

  it('it should be successful if result object has doc key equal "employee" and _id equal "employeeId = 111"', async () => {
    const employeeData = await readDatabases.GET_EMPLOYEE_DATA_BY_ID(employeeId);
    expect(employeeData).toEqual(expect.objectContaining({ doc: 'employee' }));
    expect(employeeData).toEqual(expect.objectContaining({ _id: employeeId }));
  });

  it('it should be successful if result object has doc key equal "employee" and name key equal "theName = John" and surname key equal "theSurname = Doe"', async () => {
    const employeeData = await readDatabases.GET_EMPLOYEE_DATA_BY_NAME('John', 'Doe');
    expect(employeeData).toEqual(expect.objectContaining({ doc: 'employee' }));
    expect(employeeData).toEqual(expect.objectContaining({ name: theName, surname: theSurname }));
  });
});

// UPDATE
describe('Updating employees', () => {
  const employeeId = '111';
  const theYear = 2021;
  const theMonth = 1;
  const employeeNewBasicData: IBasicEmployeeData = {
    _id: '111',
    doc: 'employee',
    name: 'John',
    surname: 'Smith',
    position: 'Kat',
    juvenileWorker: false,
    employmentStatus: true,
    overdueLeaveAmount: 5,
    assignedLeaveAmount: 26,
    employmentStartDate: { day: 1, month: 1, year: 2015 },
    employmentTerminationDate: null,
  };

  const employeeNewRatesData: IMonthRates = {
    month: 1,
    hourlyRate: 2,
    overtimeRate: 2,
    holidayRate: 2,
    sickLeaveRate: 2,
    otherLeaveRate: 2,
    insuranceRate: 2,
    retainmentRate: 2,
    bonusRate: 2,
    toAccountRate: 2,
    overtimeRateMultiplier: 2,
    overtimeHoursMultiplier: 2,
  };

  const employeeNewLeaveData: IDateRange = {
    from: { day: 1, month: 1, year: 2011 },
    to: { day: 1, month: 1, year: 2011 },
  };

  const employeeNewTrsData: ITrsData = {
    workingHours: 8,
    overtimeHours: 4,
    weekendHours: 0,
    dueDate: { day: 1, month: 1, year: 2011 },
    evaluation: [],
  };

  it('it should be successful if given employee exists and employee basic info was updated', async () => {
    const result = await updateDatabases.UPDATE_BASIC_EMPLOYEE_DATA_BY_EMPLOYEE_ID(employeeId, employeeNewBasicData);
    expect(result.message).toEqual('The employee basic data was updated!');
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(1);
  });

  it('it should be successful if given employee exists and employee rates are updated', async () => {
    const result = await updateDatabases.UPDATE_EMPLOYEE_RATE_DATA_BY_EMPLOYEE_ID_YEAR_MONTH(
      employeeId,
      theYear,
      theMonth,
      employeeNewRatesData
    );
    expect(result.message).toEqual('The employee rates data was updated!');
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(1);
  });

  it('it should be successful if given employee exists and new holiday leave was created', async () => {
    const queryFields: IQueryFields = {
      name: 'holiday',
      year: theYear,
      month: theMonth,
    };
    const result = await updateDatabases.CREATE_EMPLOYEE_LEAVE_ENTRY(employeeId, queryFields, employeeNewLeaveData);
    expect(result.message).toEqual(`The employee ${queryFields.name} leave entry was created!`);
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(1);
  });

  it('it should be successful if given employee exists and new sick leave was created', async () => {
    const queryFields: IQueryFields = {
      name: 'sick',
      year: theYear,
      month: theMonth,
    };
    const result = await updateDatabases.CREATE_EMPLOYEE_LEAVE_ENTRY(employeeId, queryFields, employeeNewLeaveData);
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(1);
    expect(result.message).toEqual(`The employee ${queryFields.name} leave entry was created!`);
  });

  it('it should be successful if given employee exists and new other leave was created', async () => {
    const queryFields: IQueryFields = {
      name: 'other',
      year: theYear,
      month: theMonth,
    };
    const result = await updateDatabases.CREATE_EMPLOYEE_LEAVE_ENTRY(employeeId, queryFields, employeeNewLeaveData);
    expect(result.message).toEqual(`The employee ${queryFields.name} leave entry was created!`);
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(1);
  });

  it('it should be successful if given employee exists and given holiday leave was removed', async () => {
    const queryFields: IQueryFields = {
      name: 'holiday',
      year: theYear,
      month: theMonth,
    };
    const result = await updateDatabases.REMOVE_EMPLOYEE_LEAVE_ENTRY(employeeId, queryFields, employeeNewLeaveData);
    expect(result.message).toEqual(`The employee ${queryFields.name} leave entry was removed!`);
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(1);
  });

  it('it should be successful if given employee exists and given sick leave was removed', async () => {
    const queryFields: IQueryFields = {
      name: 'sick',
      year: theYear,
      month: theMonth,
    };
    const result = await updateDatabases.REMOVE_EMPLOYEE_LEAVE_ENTRY(employeeId, queryFields, employeeNewLeaveData);
    expect(result.message).toEqual(`The employee ${queryFields.name} leave entry was removed!`);
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(1);
  });

  it('it should be successful if given employee exists and given other leave was removed', async () => {
    const queryFields: IQueryFields = {
      name: 'other',
      year: theYear,
      month: theMonth,
    };
    const result = await updateDatabases.REMOVE_EMPLOYEE_LEAVE_ENTRY(employeeId, queryFields, employeeNewLeaveData);
    expect(result.message).toEqual(`The employee ${queryFields.name} leave entry was removed!`);
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(1);
  });

  it('it should be successful if given employee exists and new trs data was created or updated', async () => {
    const queryFields: IQueryFields = {
      name: 'other',
      year: theYear,
      month: theMonth,
    };
    const result = await updateDatabases.CREATE_UPDATE_EMPLOYEE_TRS_DATA_ENTRY(
      employeeId,
      queryFields,
      employeeNewTrsData
    );
    expect(result.message).toEqual(`The employee trs data was updated!`);
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(1);
  });

  it('it should be successful if given employee exists, given year do not exist in employee calendar and data for given year was created', async () => {
    const year = 2022;
    const inputRatesData = employeeNewRatesData;
    const result = await updateDatabases.CREATE_NEW_YEAR_EMPLOYEE_CALENDAR(employeeId, year, inputRatesData);
    expect(result.message).toEqual(`The ${year} year data was created!`);
    expect(result.status).toBeTruthy();
    expect(result.value).toEqual(1);
  });
});
