const { gql } = require('apollo-server');

module.exports = gql`
    type User {
        email: String!
        token: String
    }

    type Query {
        getUsers: [User]!
    }
    
    type Mutation {
        register(
            email: String! 
            password: String 
            confirmPassword: String!
        ): User!

        login(
            email: String!
            password: String!
        ): User!
    }
`;
