import AsyncNedb from 'nedb-async';
import {
  IDate,
  IDateRange,
  IEmployeesData,
  IMonthRates,
  IPublicHolidays,
  IResponsibilities,
} from '../db/actions/_types';
import {
  checkEesExist,
  checkEmployeeExist,
  checkExistingLeaveData,
  checkHolidaysExist,
  checkResponsibilitiesExist,
  createLeaveUpdateData,
  getCalendarMonthIndex,
  getCalendarRtsDayIndex,
  getCalendarYearIndex,
  makeCalendar,
} from '../db/actions/utils';
import getDbConnection from '../db/connection';

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

describe('Check if employee exist', () => {
  const id = '111';
  const name = 'John';
  const surname = 'Smith';
  const idInput = { id };
  const nameInput = { name, surname };

  it('should return status true and massage "The employee does exist!" if employee exists in the employees database when calling with employee ID', async () => {
    const result = await checkEmployeeExist(idInput);
    expect(result.message).toEqual('The employee does exist!');
    expect(result.status).toBeTruthy();
  });

  it('should return status false and massage "The employee does not exist!" if employee do not exists in the employees database when calling with employee NAME and SURNAME', async () => {
    const result = await checkEmployeeExist(nameInput);
    expect(result.message).toEqual('The employee does exist!');
    expect(result.status).toBeTruthy();
  });
});

describe('Get indexes from an employee data array', () => {
  const exampleEmployeeData: IEmployeesData = {
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
            rts: [
              {
                workingHours: 8,
                overtimeHours: 4,
                weekendHours: 0,
                dueDate: { day: 1, month: 2, year: 2021 },
                evaluation: [],
              },
            ],
          },
          {
            month: 2,
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
          {
            month: 3,
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
  const year = 2021;
  const month = 1;
  const dayDate: IDate = { day: 1, month: 2, year: 2021 };

  it('should return -1 when the given year does not exist for given example employee data', () => {
    const yearIndex = getCalendarYearIndex(exampleEmployeeData, 1111);
    expect(yearIndex).toEqual(-1);
  });

  it('should return a number greater or equal to 0 if a given year exist inside given example employee data', () => {
    const yearIndex = getCalendarYearIndex(exampleEmployeeData, year);
    expect(yearIndex).toBeGreaterThanOrEqual(0);
  });

  it('should return 0 when the year is equal to 2021 for given example employee data', () => {
    const yearIndex = getCalendarYearIndex(exampleEmployeeData, year);
    expect(yearIndex).toEqual(0);
  });

  it('should return -1 when the given month does not exist for given example employee data', () => {
    const monthIndex = getCalendarMonthIndex(exampleEmployeeData, year, 13);
    expect(monthIndex).toEqual(-1);
  });

  it('should return a number greater or equal to 0 if a given month exist inside given example employee data', () => {
    const monthIndex = getCalendarMonthIndex(exampleEmployeeData, year, month);
    expect(monthIndex).toBeGreaterThanOrEqual(0);
  });

  it('should return 0 when the month is equal to 1 for given example employee data', () => {
    const monthIndex = getCalendarMonthIndex(exampleEmployeeData, year, month);
    expect(monthIndex).toEqual(0);
  });

  it('should return -1 when the given day date does not equals due date inside given example employee calendar rts dueDate data', () => {
    const dayIndex = getCalendarRtsDayIndex(exampleEmployeeData, year, month, { day: 111, month: 1, year: 2021 });
    expect(dayIndex).toEqual(-1);
  });

  it('should return a number greater or equal to 0 if a given day date equals due date inside given example employee calendar rts dueDate data', () => {
    const dayIndex = getCalendarRtsDayIndex(exampleEmployeeData, year, month, dayDate);
    expect(dayIndex).toBeGreaterThanOrEqual(0);
  });

  it('should return 0 when the given day date is equal to { day: 1, month: 2, year: 2021 } inside given example employee calendar rts dueDate data', () => {
    const dayIndex = getCalendarRtsDayIndex(exampleEmployeeData, year, month, dayDate);
    expect(dayIndex).toEqual(0);
  });
});

describe('Check if leave data exist', () => {
  const exampleEmployeeData: IEmployeesData = {
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
            holidayLeave: [
              {
                from: { day: 1, month: 1, year: 2021 },
                to: { day: 7, month: 1, year: 2021 },
              },
            ],
            sickLeave: [
              {
                from: { day: 8, month: 1, year: 2021 },
                to: { day: 12, month: 1, year: 2021 },
              },
            ],
            otherLeave: [
              {
                from: { day: 13, month: 1, year: 2021 },
                to: { day: 17, month: 1, year: 2021 },
              },
            ],
            rts: [
              {
                workingHours: 8,
                overtimeHours: 4,
                weekendHours: 0,
                dueDate: { day: 1, month: 2, year: 2021 },
                evaluation: [],
              },
            ],
          },
        ],
      },
    ],
  };
  const exampleUpdateTruthyData: IDateRange = {
    from: { day: 1, month: 1, year: 2021 },
    to: { day: 7, month: 1, year: 2021 },
  };
  const exampleUpdateFalsyData: IDateRange = {
    from: { day: 20, month: 1, year: 2021 },
    to: { day: 27, month: 1, year: 2021 },
  };
  const yearIndex = 0;
  const monthIndex = 0;
  const leaveOptionHoliday = 'holiday';
  const exampleHolidayUpdateTruthyData = exampleUpdateTruthyData;
  const leaveOptionSick = 'sick';
  const exampleSickUpdateTruthyData: IDateRange = {
    from: { day: 8, month: 1, year: 2021 },
    to: { day: 12, month: 1, year: 2021 },
  };
  const leaveOptionOther = 'other';
  const exampleOtherUpdateTruthyData: IDateRange = {
    from: { day: 13, month: 1, year: 2021 },
    to: { day: 17, month: 1, year: 2021 },
  };

  it('should return true if the searched date range exist inside given leave option', () => {
    const result = checkExistingLeaveData(
      exampleEmployeeData,
      exampleUpdateTruthyData,
      yearIndex,
      monthIndex,
      leaveOptionHoliday
    );
    expect(result).toBeTruthy();
  });

  it('should return false if the searched date range does not exist inside given leave option', () => {
    const result = checkExistingLeaveData(
      exampleEmployeeData,
      exampleUpdateFalsyData,
      yearIndex,
      monthIndex,
      leaveOptionHoliday
    );
    expect(result).toBeFalsy();
  });

  it('should return true if the searched holiday date range exist inside given holiday leave data', () => {
    const result = checkExistingLeaveData(
      exampleEmployeeData,
      exampleHolidayUpdateTruthyData,
      yearIndex,
      monthIndex,
      leaveOptionHoliday
    );
    expect(result).toBeTruthy();
  });

  it('should return true if the searched sick date range exist inside given sick leave data', () => {
    const result = checkExistingLeaveData(
      exampleEmployeeData,
      exampleSickUpdateTruthyData,
      yearIndex,
      monthIndex,
      leaveOptionSick
    );
    expect(result).toBeTruthy();
  });

  it('should return true if the searched other leave date range exist inside given other leave data', () => {
    const result = checkExistingLeaveData(
      exampleEmployeeData,
      exampleOtherUpdateTruthyData,
      yearIndex,
      monthIndex,
      leaveOptionOther
    );
    expect(result).toBeTruthy();
  });
});

describe('Create leave data object', () => {
  const holidayName = 'holiday';
  const sickName = 'sick';
  const otherName = 'other';
  const yearIndex = 0;
  const monthIndex = 0;
  const dateRange: IDateRange = {
    from: { day: 1, month: 1, year: 2021 },
    to: { day: 7, month: 1, year: 2021 },
  };

  it('should return holiday object { calendar.0.months.0.holidayLeave: { from: { day: 1, month: 1, year: 2021 }, to: { day: 7, month: 1, year: 2021 } } }', () => {
    const result = createLeaveUpdateData(holidayName, yearIndex, monthIndex, dateRange);
    expect(result).toStrictEqual({
      'calendar.0.months.0.holidayLeave': {
        from: { day: 1, month: 1, year: 2021 },
        to: { day: 7, month: 1, year: 2021 },
      },
    });
  });

  it('should return sick object { calendar.0.months.0.sickLeave: { from: { day: 1, month: 1, year: 2021 }, to: { day: 7, month: 1, year: 2021 } } }', () => {
    const result = createLeaveUpdateData(sickName, yearIndex, monthIndex, dateRange);
    expect(result).toStrictEqual({
      'calendar.0.months.0.sickLeave': {
        from: { day: 1, month: 1, year: 2021 },
        to: { day: 7, month: 1, year: 2021 },
      },
    });
  });

  it('should return other leave object { calendar.0.months.0.otherLeave: { from: { day: 1, month: 1, year: 2021 }, to: { day: 7, month: 1, year: 2021 } } }', () => {
    const result = createLeaveUpdateData(otherName, yearIndex, monthIndex, dateRange);
    expect(result).toStrictEqual({
      'calendar.0.months.0.otherLeave': {
        from: { day: 1, month: 1, year: 2021 },
        to: { day: 7, month: 1, year: 2021 },
      },
    });
  });
});

describe('Create calendar data object', () => {
  const year = 2022;
  const ratesData: IMonthRates = {
    month: 12,
    hourlyRate: 0,
    overtimeRate: 0,
    holidayRate: 0,
    sickLeaveRate: 0,
    otherLeaveRate: 0,
    insuranceRate: 0,
    retainmentRate: 0,
    bonusRate: 0,
    toAccountRate: 0,
    overtimeRateMultiplier: 0,
    overtimeHoursMultiplier: 0,
  };

  it('should return object with year equal 2022 and months array containing 12 months with rates passed with ratesData variable', () => {
    const result = makeCalendar(year, ratesData);
    expect(result.year).toEqual(2022);
    expect(result.months).toHaveLength(12);
    expect(result.months[11]).toStrictEqual({ ...ratesData, holidayLeave: [], sickLeave: [], otherLeave: [], rts: [] });
  });
});

describe('Check if ees exist', () => {
  const truthySymbol = '4H';
  const falsySymbol = '3GGG';

  it('should return status true and massage "The ees does exist!" if ees exists in the ees database when calling with ees SYMBOL', async () => {
    const result = await checkEesExist({ symbol: truthySymbol });
    expect(result.message).toEqual('The ees does exist!');
    expect(result.status).toBeTruthy();
  });

  it('should return status false and massage "The ees does not exist!" if ees do not exists in the ees database when calling with ees SYMBOL', async () => {
    const result = await checkEesExist({ symbol: falsySymbol });
    expect(result.message).toEqual('The ees does not exist!');
    expect(result.status).toBeFalsy();
  });
});

describe('Check if public holidays exist', () => {
  const falsyYear = 2035;

  it('should return status true and massage "The public holidays does exist!" if holidays exists in the holidays database when calling with holidays YEAR', async () => {
    const holidaysDB: AsyncNedb<IPublicHolidays> = await getDbConnection('holidays');
    const holidaysArray: IPublicHolidays[] = await holidaysDB.asyncFind({});
    const truthyYear = holidaysArray[0].year;

    const result = await checkHolidaysExist(truthyYear);
    expect(result.message).toEqual('The public holidays does exist!');
    expect(result.status).toBeTruthy();
  });

  it('should return status false and massage "The public holidays does not exist!" if holidays do not exists in the holidays database when calling with holidays YEAR', async () => {
    const result = await checkHolidaysExist(falsyYear);
    expect(result.message).toEqual('The public holidays does not exist!');
    expect(result.status).toBeFalsy();
  });
});

describe('Check if public responsibilities exist', () => {
  const falsyId = '333';

  it('should return status true and massage "The responsibilities for the given employee does exist!" if responsibilities exists in the responsibilities database when calling with employee ID', async () => {
    const responsibilitiesDB: AsyncNedb<IResponsibilities> = await getDbConnection('responsibilities');
    const responsibilitiesArray: IResponsibilities[] = await responsibilitiesDB.asyncFind({});
    const truthyId = responsibilitiesArray[0].employee;
    const result = await checkResponsibilitiesExist(truthyId);
    expect(result.message).toEqual('The responsibilities for the given employee does exist!');
    expect(result.status).toBeTruthy();
  });

  it('should return status false and massage "The responsibilities does not exist!" if responsibilities do not exists in the responsibilities database when calling with employee ID', async () => {
    const result = await checkResponsibilitiesExist(falsyId);
    expect(result.message).toEqual('The responsibilities for the given employee does not exist!');
    expect(result.status).toBeFalsy();
  });
});
