const { gql } = require('apollo-server');

module.exports = gql`
    type User {
        email: String!
        token: String
        latestMessage: Message
    }

    type Message {
        id: String!
        content: String!
        from: String!
        to: String!
        createdAt: String!
    }

    type Query {
        getUsers: [User]!
        getMessages(from:String!): [Message]!
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
        
        sendMessage(to: String! content: String!): Message! 
    }
`;
