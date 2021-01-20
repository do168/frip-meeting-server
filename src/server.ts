import { App } from './App';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV == 'development' ? '.env.development' : '.env.test'),
});
const app: App = new App();

const port = parseInt(process.env.PORT || '4080');
app
  .run(port)
  .then(() => {
    console.log(`Server is running on http://localhost:${port}`);
  })
  .catch((e) => {
    console.error(`Server error:`, e);
    process.exit(9);
  });

// 서버 재시작시 기존 작업을 마무리 할수 있는 시간을 둔다.
process.on('SIGINT', () => {
  console.info('SIGINT signal received.');

  app
    .close()
    .then(() => {
      console.info('process  exit!!!');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
});
