import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import resolvers from '../src/graphql/resolver';
import typeDefs from '../src/graphql/typeDef';

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

const { query, mutate } = createTestClient(server);

test('select meeting', async () => {
  const SELECT_MEETING = gql`
    query {
      meeting(id: 1) {
        id
        hostId
      }
    }
  `;

  const {
    data: { meeting },
  } = await query({ query: SELECT_MEETING });

  expect(meeting).toBe({ id: 1, hostId: 'testid' });
});
