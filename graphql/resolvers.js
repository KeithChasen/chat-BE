const {UserInputError} = require('apollo-server');
const bcrypt = require('bcryptjs');

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
          hashPassword
        });

        const userResponse = await newUser.save();

        return userResponse;

      } catch (err) {
        console.log(err);
        throw new UserInputError('Validation errors', {
          errors: err
        });
      }
    }
  }
};
