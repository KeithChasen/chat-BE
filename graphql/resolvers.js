const User = require('../mongo/User');

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        return await User.find();
      } catch (err) {
        console.log(err)
      }
    },
  },
};
