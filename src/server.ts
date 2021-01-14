import config from 'config';
import { App } from './App';

const app: App = new App();
const port = parseInt(process.env.PORT || config.get('server.port'));

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
