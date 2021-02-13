const { gql } = require('apollo-server');
const {
  getAllActors,
  getActorRoles,
  getActorById,
  getActorsByName,
  getMovieCast,
} = require('./dbApi');

const typeDefs = gql`
  type Actor {
    actorId: ID!
    name: String!
    gender: String
    roles: [Role]
  }

  type Role {
    role: String
    movie: Movie
    actor: Actor
  }

  extend type Movie @key(fields: "movieId") {
    movieId: ID! @external
    cast: [Role]
  }

  extend type Query {
    allActors: [Actor]
    actor(actorId: ID!): Actor
    actors(name: String!): [Actor]
  }
`;

const resolvers = {
  Query: {
    allActors() {
      return getAllActors();
    },
    actor(_, { actorId }) {
      return getActorById(actorId);
    },
    actors(_, { name }) {
      return getActorsByName(name);
    },
  },
  Actor: {
    roles: (actor) => getActorRoles(actor.actorId),
  },
  Role: {
    movie: (role) => ({ __typename: 'Movie', movieId: role.movieId }),
    actor: (role) => getActorById(role.actorId),
  },
  Movie: {
    cast: (movie) => getMovieCast(movie.movieId),
  },
};

module.exports = { typeDefs, resolvers };
