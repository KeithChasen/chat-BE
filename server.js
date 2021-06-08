const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`  
  type User {
      username: String!
      email: String!
  }
  
  type Query {
    getUsers: [User]!
  }
`;

const resolvers = {
  Query: {
    getUsers: () => {
      return [{ id: 1, username: 'john', email: 'john@mail.com'}, { id: 2, username: 'jack', email: 'jack@mail.com'}];
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
