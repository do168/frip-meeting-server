import { readFileSync } from 'fs';
import { createConnection } from 'mysql2/promise';
// import { Mysql as mysql } from '../src/config/mysql';

export async function createSchema(): Promise<void> {
  const con = await createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '4531',
    database: '',
    connectionLimit: 10,
    multipleStatements: true,
  });
  await con.query('DROP DATABASE IF EXISTS frientripTest');

  const schema = readFileSync(`${__dirname}/../internals/schema.sql`).toString();
  const replaced = schema.replace(/`frip`/g, '`frientripTest`');
  // console.log(replaced);

  await con.query(replaced);
  con.destroy();
}
