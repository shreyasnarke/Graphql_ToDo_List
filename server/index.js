const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Todo {
    id: ID!
    title: String!
    completed: Boolean
    userId: ID!
    user: User
  }

  type Query {
    todos: [Todo]
  }
`;

const resolvers = {
  Todo: {
    user: async (todo) => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },
  },
  Query: {
    todos: async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
        return response.data;
      } catch (error) {
        console.error("Error fetching todos:", error);
        return [];
      }
    },
  },
};

async function startServer() {
  const app = express();
  
  // Apply CORS first
  app.use(cors());
  
  // Then apply body parser
  app.use(bodyParser.json());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  app.use('/graphql', expressMiddleware(server));

  app.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
    console.log('GraphQL endpoint at http://localhost:8000/graphql');
  });
}

startServer();