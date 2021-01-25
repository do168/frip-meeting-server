import {
  DateFormatException,
  FullParticipationException,
  NotCreationException,
  NotExistsException,
  NotFoundException,
  NullException,
  ReviewConditionException,
  TimeLimitException,
  TypeException,
} from '../util/customException';
import { toApolloError } from 'apollo-server-express';
import { GraphQLError } from 'graphql';

/**
 * Domain 에서 발생하는 오류를 ApolloError로 변환한다.
 *
 * @param err Error
 * @return Error
 */
export function errorHandler(err: Error): Error {
  if (
    err instanceof GraphQLError &&
    err.originalError instanceof
      (NullException ||
        TypeException ||
        NotCreationException ||
        NotExistsException ||
        TimeLimitException ||
        FullParticipationException ||
        ReviewConditionException ||
        NotFoundException ||
        DateFormatException)
  ) {
    return toApolloError(err, err.originalError.code);
  } else if (
    err instanceof
    (NullException ||
      TypeException ||
      NotCreationException ||
      NotExistsException ||
      TimeLimitException ||
      FullParticipationException ||
      ReviewConditionException ||
      NotFoundException ||
      DateFormatException)
  ) {
    return toApolloError(err, err.code);
  } else {
    console.error('internal server error:', err); // internal server error
  }
  return err;
}
