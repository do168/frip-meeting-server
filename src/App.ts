import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import morgan from 'morgan';
import swaggerRoute from './middleware/swaggerRoute';
import meetingRoute from './routes/meetingRoute';
import reviewRoute from './routes/reviewRoute';

export class App {
  public express: express.Application;
  private httpServer: http.Server | null = null;
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  public async run(port: number): Promise<void> {
    this.httpServer = this.express.listen(port);
  }

  public async close(): Promise<void> {
    this.httpServer?.close();
  }

  public middleware(): void {
    this.express.use(express.json());
    this.express.use(morgan('dev'));
    this.express.use(swaggerRoute);
  }

  public routes(): void {
    this.express.use('/meetings', meetingRoute);
    this.express.use('/reviews', reviewRoute);

    // 404 error handling
    this.express.use((req: Request, res: Response, next: NextFunction) => {
      return res.status(404).json({
        message: 'Not Found',
      });
    });

    // 500 internal error handling
    this.express.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      console.error(err.message);
      res.status(500).send({ status: 500, message: 'internal error', type: 'internal' });
    });
  }
}
