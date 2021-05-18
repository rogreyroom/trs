import { IUser } from '../db/actions/_types';
import readDatabases from '../db/actions/read';

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

// FIND
describe('Finding app user)', () => {
  const userName = 'test';

  it('it should be successful if userData object has doc key equal "users" and user key equal "userName = test"', async () => {
    const userData = await readDatabases.GET_USER_BY_NAME(userName);
    expect(userData).toEqual(expect.objectContaining({ doc: 'users' }));
    expect(userData).toEqual(expect.objectContaining({ user: userName }));
  });
});
