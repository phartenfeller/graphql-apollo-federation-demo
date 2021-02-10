const { gql } = require('apollo-server');
const { getMoviesByTitle } = require('./dbApi');

const typeDefs = gql`
  type Movie {
    movieId: ID!
    title: String!
    year: Int!
    runtime: Int
    description: String
  }

  type Query {
    movies(title: String!): [Movie]
  }
`;

const resolvers = {
  Query: {
    movies(_, { title }) {
      return getMoviesByTitle(title);
    },
  },
};

module.exports = { typeDefs, resolvers };
