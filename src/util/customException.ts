export class NullException extends Error {
  status: number;
  code: string;
  constructor(value: unknown) {
    super(value + ' cannot be null');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
    this.code = 'EXTERNAL_CLIENT_ERROR';
  }
}

export class TypeException extends Error {
  status: number;
  code: string;
  constructor() {
    super('type is different');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
    this.code = 'EXTERNAL_CLIENT_ERROR';
  }
}

export class NotCreationException extends Error {
  status: number;
  code: string;
  constructor() {
    super('등록되지 않았습니다!. 잠시 후 다시 시도해보세요');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
    this.code = 'EXTERNAL_CLIENT_ERROR';
  }
}

export class NotExistsException extends Error {
  status: number;
  code: string;

  constructor() {
    super("Parameter Error! - data didn't inserted Or data dosen't exists");
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
    this.code = 'EXTERNAL_CLIENT_ERROR';
  }
}

export class TimeLimitException extends Error {
  status: number;
  code: string;

  constructor(message: string) {
    super(message);
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
    this.code = 'EXTERNAL_CLIENT_ERROR';
  }
}

export class FullParticipationException extends Error {
  status: number;
  code: string;
  constructor() {
    super('참가 인원이 꽉 찼습니다!');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
    this.code = 'EXTERNAL_CLIENT_ERROR';
  }
}

export class ReviewConditionException extends Error {
  status: number;
  code: string;
  constructor() {
    super('모임 참석자만 리뷰가 가능합니다');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
    this.code = 'EXTERNAL_CLIENT_ERROR';
  }
}

export class NotFoundException extends Error {
  status: number;
  code: string;
  constructor() {
    super('Not found');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 404;
    this.code = 'EXTERNAL_CLIENT_ERROR';
  }
}

export class DateFormatException extends Error {
  status: number;
  code: string;
  constructor() {
    super('날짜 형식이 잘못되었습니다!');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
    this.code = 'EXTERNAL_CLIENT_ERROR';
  }
}

export class DBException extends Error {
  status: number;
  constructor() {
    super('DB에서 알 수 없는 오류가 발생하였습니다');
    this.name = 'Server';
    this.stack = Error().stack;
    this.status = 500;
  }
}
