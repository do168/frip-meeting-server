import { createPool } from 'mysql2/promise';
import { dbConfig } from '../config/dbconfig';

const pool = createPool(dbConfig);

export class Mysql {
  public static connect = (fn: any) => async (...args: any) => {
    /* DB 커넥션을 한다. */
    const con: any = await pool.getConnection();
    /* 로직에 con과 args(넘겨받은 paramter)를 넘겨준다. */
    const result = await fn(con, ...args).catch((error: any) => {
      /* 에러시 con을 닫아준다. */
      con.connection.release();
      throw error;
    });
    /* con을 닫아준다. */
    con.connection.release();
    return result;
  };

  public static transaction = (fn: any) => async (...args: any) => {
    /* DB 커넥션을 한다. */
    const con: any = await pool.getConnection();
    /* 트렌젝션 시작 */
    await con.connection.beginTransaction();
    /* 비지니스 로직에 con을 넘겨준다. */
    const result = await fn(con, ...args).catch(async (error: any) => {
      /* rollback을 진행한다. */
      await con.rollback();
      /* 에러시 con을 닫아준다. */
      con.connection.release();
      throw error;
    });
    /* commit을 해준다. */
    await con.commit();
    /* con을 닫아준다. */
    con.connection.release();
    return result;
  };
}
