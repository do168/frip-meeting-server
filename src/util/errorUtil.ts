/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NextFunction, Response, Request } from 'express';

export function handleError(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.name == 'Client') {
    return res.status(err.status).json({
      message: err.message,
      type: 'External Client Error',
    });
  } else {
    return res.status(500).json({ message: err.message || 'internal error', type: 'internal', stack: err.stack });
  }
}

export default { handleError };
