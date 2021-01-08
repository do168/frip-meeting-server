import { createSchema } from './schemaUtils';

beforeAll(async () => {
  await createSchema();
});

test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
