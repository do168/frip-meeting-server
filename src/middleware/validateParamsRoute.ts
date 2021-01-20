/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Request, Response, NextFunction } from 'express';
import { TypeException } from '../util/customException';

// body param 타입 체크
export const validateBodyParams = (requestParams: any) => {
  return function (req: Request, _res: Response, next: NextFunction) {
    try {
      for (const param of requestParams) {
        if (checkParamPresent(Object.keys(req.body), param)) {
          const reqParam = req.body[param.param_key];
          checkParamType(reqParam, param);
        }
      }
    } catch (error) {
      return next(error);
    }
    return next();
  };
};

// path param 타입 체크
export const validatePathParams = (requestParams: any) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      for (const param of requestParams) {
        if (checkParamPresent(Object.keys(req.params), param)) {
          const reqParam = req.params[param.param_key];
          checkParamType(reqParam, param);
        }
      }
    } catch (error) {
      return next(error);
    }
    return next();
  };
};

// query param 타입 체크
export const validateQueryParams = (requestParams: any) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      for (const param of requestParams) {
        if (checkParamPresent(Object.keys(req.query), param)) {
          const reqParam = req.query[param.param_key];
          checkParamType(reqParam, param);
        }
      }
    } catch (error) {
      return next(error);
    }
    return next();
  };
};

// null 값 체크
const checkParamPresent = function (reqParams: any, paramObj: any) {
  return reqParams.includes(paramObj.param_key);
};

// 타입 체크
const checkParamType = function aysnc(reqParam: any, paramObj: any) {
  // 숫자인 param 체크
  if (paramObj.type === 'number') {
    if (isNaN(Number(reqParam)) || Number(reqParam) < 0) {
      throw new TypeException();
    }
  } else {
    // 문자인 param 체크
    const reqParamType = typeof reqParam;
    return reqParamType === paramObj.type;
  }
};
