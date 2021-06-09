const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const User = require('../../mongo/User');
const config = fs.existsSync(`${__dirname}/../../config.js`)? require(`${__dirname}/../../config.js`) : null;
const jwtSecret = process.env.JWT || config.JWT;

const generateToken = user => jwt.sign({
  id: user.id,
  email: user.email
}, jwtSecret, { expiresIn: '1h' });

module.exports = {
  Query: {
    getUsers: async (_, __, context) => {
      try {
        if (!context.user)
          throw new AuthenticationError('Unauthenticated');

        return await User.find({ email: { $ne: context.user.email }});
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      const { email, password, confirmPassword } = args;
      let errors = {};

      try {
        if (email.trim() === '') errors.email = 'Email must not be empty';
        if (password.trim() === '') errors.password = 'Password must not be empty';
        if (confirmPassword !== password) errors.confirmPassword = 'Password should match';

        const user = await User.findOne({ email });

        if (user) {
          errors.email ='Such email is already in use'
        }

        if(Object.keys(errors).length) {
          throw errors;
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
          email,
          password: hashPassword
        });

        return await newUser.save();

      } catch (err) {
        console.log(err);
        throw new UserInputError('Validation errors', {
          errors: err
        });
      }
    },
    login: async (_, args) => {
      const { email, password} = args;
      let errors = {};

      try {
        if (email.trim() === '') errors.email = 'Email must not be empty';
        if (password.trim() === '') errors.password = 'Password must not be empty';

        const user = await User.findOne({ email });

        console.log(user, 'user')

        if (!user) {
          errors.email = 'User is not exists';
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          errors.password = 'Wrong creds';
        }

        if(Object.keys(errors).length) {
          throw errors;
        }

        const token = generateToken(user);

        return {
          ...user._doc,
          id: user._id,
          token
        };

      } catch (err) {
        console.log(err);
        throw new UserInputError('Validation errors', {
          errors: err
        });
      }
    }
  }
};
