const authResolvers = require('./auth');
const messageResolvers = require('./message');

module.exports = {
  Query: {
    ...authResolvers.Query,
    ...messageResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...messageResolvers.Mutation
  }
};
