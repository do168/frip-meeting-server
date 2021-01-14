import { NextFunction, Response, Request } from 'express';

export function handleError(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  console.error(err.message);
  if (err.name == 'Client') {
    return res.status(err.status).json({
      message: err.message,
      type: 'External Client Error',
    });
  } else {
    return res.status(500).json({ message: 'internal error', type: 'internal' });
  }
}

export default { handleError };
