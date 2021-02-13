const { gql } = require('apollo-server');
const { getMoviesByTitle, getMovieById } = require('./dbApi');

const typeDefs = gql`
  type Movie @key(fields: "movieId") {
    movieId: ID!
    title: String!
    year: Int!
    runtime: Int
    description: String
  }

  extend type Query {
    movies(title: String!): [Movie]
  }
`;

const resolvers = {
  Query: {
    movies(_, { title }) {
      return getMoviesByTitle(title);
    },
  },
  Movie: {
    // eslint-disable-next-line no-underscore-dangle
    __resolveReference(ref) {
      console.log(
        'Movie-Service called by Actor-Service with movie:',
        ref.movieId
      );
      return getMovieById(ref.movieId);
    },
  },
};

module.exports = { typeDefs, resolvers };
