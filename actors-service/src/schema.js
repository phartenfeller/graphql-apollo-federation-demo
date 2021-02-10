const { gql } = require('apollo-server');
const {
  getAllActors,
  getActorRoles,
  getActorById,
  getActorsByName,
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
    movieId: ID!
  }

  type Query {
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
    roles(parent) {
      return getActorRoles(parent.actorId);
    },
  },
};

module.exports = { typeDefs, resolvers };
