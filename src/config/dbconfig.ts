// ./config/dbconfig
// mysql config file
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV == 'development' ? '.env.development' : '.env.test'),
});

export const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE,
  connectionLimit: Number(process.env.DB_DB_CONNECTIONLIMIT) || 10,
  multipleStatements: true, // 여러 쿼리를 ';'를 기준으로 한번에 보낼 수 있게한다.
};
