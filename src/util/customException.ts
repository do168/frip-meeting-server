export class NullException extends Error {
  status: number;
  constructor(value: any) {
    super(value + ' cannot be null');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
  }
}

export class TypeException extends Error {
  status: number;
  constructor() {
    super('type is different');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
  }
}

export class NotCreationException extends Error {
  status: number;
  constructor() {
    super('등록되지 않았습니다!. 잠시 후 다시 시도해보세요');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
  }
}

export class NotExistsException extends Error {
  status: number;
  constructor() {
    super("Parameter Error! - data didn't inserted Or data dosen't exists");
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
  }
}

export class TimeLimitException extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
  }
}

export class FullParticipationException extends Error {
  status: number;
  constructor() {
    super('참가 인원이 꽉 찼습니다!');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
  }
}

export class ReviewConditionException extends Error {
  status: number;
  constructor() {
    super('모임 참석자만 리뷰가 가능합니다');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
  }
}

export class NotFoundException extends Error {
  status: number;
  constructor() {
    super('Not found');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 404;
  }
}

export class DateFormatException extends Error {
  status: number;
  constructor() {
    super('날짜 형식이 잘못되었습니다!');
    this.name = 'Client';
    this.stack = Error().stack;
    this.status = 400;
  }
}
