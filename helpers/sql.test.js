const { sqlForPartialUpdate } = require('./sql');

describe('sqlForPartialUpdate', () => {
  it('should return a set of columns and values', () => {
    const dataToUpdate = { firstName: 'Aliya', age: 32 };
    const jsToSql = { firstName: 'first_name' };
    const { setCols, values } = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(setCols).toBe('"first_name"=$1, "age"=$2');
    expect(values).toEqual(['Aliya', 32]);
  });
});
