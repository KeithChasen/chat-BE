const {UserInputError, AuthenticationError } = require('apollo-server');
const User = require('../../mongo/User');
const Message = require('../../mongo/Message');

module.exports = {
  Query: {
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, context) => {
      try {
        if (!context.user)
          throw new AuthenticationError('Unauthenticated');

        const recipient = await User.findOne({ email: to });

        if (!recipient) {
          throw new UserInputError('User not found');
        } else if (recipient === context.user.email) {
          throw new UserInputError('You can not message yourself');
        }

        if (content.trim() === '') {
          throw new UserInputError('content is empty');
        }

        const message = new Message({
          from: context.user.email,
          to,
          content,
          createdAt: Date.now()
        });

        return await message.save();

      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  }
};
