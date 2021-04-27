import readDatabases from '../db/actions/read';

interface UserTypes {
  name: string;
  password: string;
  fullName: string;
  _id: string;
}

beforeEach(() => {
  process.env.NODE_ENV = 'test';
});

describe('Find user by name', () => {
  // For simplicity run ones generalDbAction tests and the this one.
  // Just to have: name: 'user' === null; name: 'updated user' !== null

  it('should to be null if user do not exists', async () => {
    const userData: UserTypes = await readDatabases.GET_USER_BY_NAME('user');
    expect(userData).toBeNull();
  });

  it('should return object with user "updated test"', async () => {
    const userData: UserTypes = await readDatabases.GET_USER_BY_NAME('updated test');
    expect(userData).not.toBeNull();
    expect(userData).toEqual(expect.objectContaining({ user: 'updated test' }));
  });
});
