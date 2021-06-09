const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const contextMiddleware = require('./util/contextMiddleware');

const config = fs.existsSync('./config.js') ? require('./config.js') : null;

const MONGO = process.env.MONGO || config.MONGO;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware
});

mongoose
  .connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Mongo is connected');
    return server.listen().then(({ url }) => {
      console.log(`Server ready at ${url}`);
    })
  })
  .catch(err => console.error(err));
