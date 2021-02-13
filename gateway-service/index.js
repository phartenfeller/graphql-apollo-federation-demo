const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "actors-service", url: "http://localhost:4001/graphql" },
    { name: "movies-service", url: "http://localhost:4002/graphql" },
  ],

  // Experimental: Enabling this enables the query plan view in Playground.
  __exposeQueryPlanExperimental: true,
});

(async () => {
  const server = new ApolloServer({
    gateway,
    engine: false,
    subscriptions: false,
  });

  server.listen().then(({ url }) => {
    console.log(`Gateway Service ready at ${url}`);
  });
})();
