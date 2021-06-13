const {UserInputError, AuthenticationError, withFilter } = require('apollo-server');
const User = require('../../mongo/User');
const Message = require('../../mongo/Message');

module.exports = {
  Query: {
    getMessages: async (parent, { from }, { user }) => {
      try {
        if (!user)
          throw new AuthenticationError('Unauthenticated');

        const companion = await User.findOne({ email: from });

        if (!companion)
          throw new UserInputError('User not found');

        return await Message.find({
          $or: [
            { $and: [{ from: user.email, to: companion.email }] },
            { $and: [{ from: companion.email, to: user.email }] }
          ]
        }).sort({ createdAt: -1});
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, { user, pubsub }) => {
      try {
        if (!user)
          throw new AuthenticationError('Unauthenticated');

        const recipient = await User.findOne({ email: to });

        if (!recipient) {
          throw new UserInputError('User not found');
        } else if (recipient === user.email) {
          throw new UserInputError('You can not message yourself');
        }

        if (content.trim() === '') {
          throw new UserInputError('content is empty');
        }

        const message = new Message({
          from: user.email,
          to,
          content,
          createdAt: Date.now()
        });

        const messageCreated = await message.save();

        pubsub.publish('NEW_MESSAGE', { newMessage: message });

        return messageCreated;

      } catch (err) {
        console.log(err);
        throw err;
      }
    }
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter((_, __, { pubsub, user }) => {
        if (!user) throw new AuthenticationError('Unauthenticated');
        return pubsub.asyncIterator(['NEW_MESSAGE']);
      }, (parent, _, { user }) => {
        return parent.newMessage.from === user.email || parent.newMessage.to === user.email;
      }),
    }
  }
};
