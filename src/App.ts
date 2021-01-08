import express from 'express';
import http from 'http';
import swaggerRoute from './middleware/swaggerRoute';
import meetingRoute from './routes/meetingRoute';

export class App {
  private express: express.Application;
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
    this.express.use(swaggerRoute);
  }

  public routes(): void {
    this.express.use('/meeting', meetingRoute);
  }
}
