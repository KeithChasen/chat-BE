module.exports = {
  Query: {
    getUsers: () => {
      return [{ id: 1, username: 'john', email: 'john@mail.com'}, { id: 2, username: 'jack', email: 'jack@mail.com'}];
    },
  },
};
