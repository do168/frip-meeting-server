export class NullException extends Error {
  status: number;
  constructor(value: any) {
    super(value + ' cannot be null');
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
