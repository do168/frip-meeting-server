// ./config/dbconfig
// mysql config file

export const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '4531',
  database: 'frip',
  connectionLimit: 10,
  multipleStatements: true, // 여러 쿼리를 ';'를 기준으로 한번에 보낼 수 있게한다.
};

export const dbConfigTest = {
  host: '127.0.0.1',
  user: 'root',
  password: '4531',
  database: 'frientripTest',
  connectionLimit: 10,
  multipleStatements: true, // 여러 쿼리를 ';'를 기준으로 한번에 보낼 수 있게한다.
};
