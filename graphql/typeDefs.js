const { gql } = require('apollo-server');

module.exports = gql`
    type User {
        email: String!
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
    }
`;
