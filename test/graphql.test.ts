import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import resolvers from '../src/graphql/resolver';
import typeDefs from '../src/graphql/typeDef';
import { errorHandler } from '../src/graphql/errorHandler';

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  formatError: errorHandler,
});

const { query, mutate } = createTestClient(server);

test('select meeting', async () => {
  const SELECT_MEETING = gql`
    {
      meeting(id: 1) {
        id
        title
      }
    }
  `;

  const response = await query({ query: SELECT_MEETING });

  expect(response.data.meeting).toEqual({ id: 1, title: '사전입력모임' });
});

test('select meetings without hostId', async () => {
  const SELECT_MEETINGS = gql`
    {
      meetings(page: { pageNum: 1, pageSize: 2 }) {
        edges {
          node {
            title
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  `;

  const response = await query({ query: SELECT_MEETINGS });

  expect(response.data.meetings).toEqual({
    edges: [
      {
        cursor: 'MU1lZXRpbmc=',
        node: {
          title: '사전입력모임',
        },
      },
      {
        cursor: 'Mk1lZXRpbmc=',
        node: {
          title: '미팅생성테스트. Test에 올라가나요?',
        },
      },
    ],
    pageInfo: {
      endCursor: 'Mk1lZXRpbmc=',
      hasNextPage: true,
    },
    totalCount: 2,
  });
});
