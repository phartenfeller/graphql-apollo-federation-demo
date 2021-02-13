const { ApolloServer } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { resolvers, typeDefs } = require('./src/schema');

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers,
    },
  ]),
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`Actors Service ready at ${url}`);
});
