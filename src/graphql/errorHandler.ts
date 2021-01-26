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
  if (err instanceof GraphQLError && err.originalError instanceof Error && err.originalError.name == 'Client') {
    return toApolloError(err, 'EXTERNAL_CLIENT_ERROR');
  } else if (err instanceof Error && err.name == 'Client') {
    return toApolloError(err, 'EXTERNAL_CLIENT_ERROR');
  } else {
    console.error('internal server error:', err); // internal server error
  }
  return err;
}
