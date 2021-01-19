import { Request, Response, NextFunction } from 'express';
import { TypeException } from '../util/customException';
export const validateBodyParams = function (requestParams: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    for (let param of requestParams) {
      if (checkParamPresent(Object.keys(req.body), param)) {
        let reqParam = req.body[param.param_key];
        if (!checkParamType(reqParam, param)) {
          throw new TypeException();
        }
      }
    }
    next();
  };
};

export const validatePathParams = function (requestParams: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    for (let param of requestParams) {
      if (checkParamPresent(Object.keys(req.params), param)) {
        let reqParam = req.params[param.param_key];
        if (!checkParamType(reqParam, param)) {
          throw new TypeException();
        }
      }
    }
    next();
  };
};

export const validateQueryParams = function (requestParams: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    for (let param of requestParams) {
      if (checkParamPresent(Object.keys(req.query), param)) {
        let reqParam = req.query[param.param_key];
        if (!checkParamType(reqParam, param)) {
          throw new TypeException();
        }
      }
    }
    next();
  };
};

const checkParamPresent = function (reqParams: any, paramObj: any) {
  return reqParams.includes(paramObj.param_key);
};

const checkParamType = function (reqParam: any, paramObj: any) {
  const reqParamType = typeof reqParam;
  console.log(reqParam, reqParamType, paramObj, paramObj.type);
  return reqParamType === paramObj.type;
};
