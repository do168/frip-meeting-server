import { Request, Response, NextFunction } from 'express';

export const wrap = (asyncFn: any): any => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await asyncFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
};
