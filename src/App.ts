import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import morgan from 'morgan';
import swaggerRoute from './middleware/swaggerRoute';
import meetingRoute from './routes/meetingRoute';
import reviewRoute from './routes/reviewRoute';
import { handleError } from './util/errorUtil';
import { NotFoundException } from './util/customException';
import { ApolloServer, defaultPlaygroundOptions } from 'apollo-server';
import typeDefs from './graphql/typeDef';
import resolvers from './graphql/resolver';

export class App {
  private express: express.Application;
  private server: ApolloServer | null = null;
  private httpServer: http.Server | null = null;
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  public buildServer(func: (ctx: any) => any): ApolloServer {
    const playgroundOptions = defaultPlaygroundOptions;
    playgroundOptions.settings['request.credentials'] = 'include';
    playgroundOptions.settings['editor.cursorShape'] = 'line';

    return new ApolloServer({
      typeDefs: typeDefs,
      resolvers: resolvers,
      context: func,
      playground: playgroundOptions,
    });
  }

  public async run(port: number): Promise<void> {
    this.server = this.buildServer(buildContext);
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
      next(new NotFoundException());
    });

    // error handling
    this.express.use(handleError);
  }

  public getExpress(): express.Application {
    return this.express;
  }
}
