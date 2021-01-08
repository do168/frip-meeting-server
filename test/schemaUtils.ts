import { readFileSync } from 'fs';
import { Mysql as mysql } from '../src/config/mysql';

export async function createSchema(): Promise<void> {
  await mysql.connect((con: any) => con.query('DROP DATABASE IF EXISTS frientripTest'))();

  const schema = readFileSync(`${__dirname}/../internals/schema.sql`).toString();
  const replaced = schema.replace(/`frip`/g, '`frientripTest`');
  // console.log(replaced);

  await mysql.connect((con: any) => con.query(replaced))();
}
