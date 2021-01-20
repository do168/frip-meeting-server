import { readFileSync } from 'fs';
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
// import { Mysql as mysql } from '../src/config/mysql';
dotenv.config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV == 'development' ? '.env.development' : '.env.test'),
});
export async function createSchema(): Promise<void> {
  const con = await createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE,
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
