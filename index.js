import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import { typeDefs } from './graphql-schema.js';

const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic(user, password)
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
});

console.log("Setting up server...");
const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => ({ req, sessionConfig: { database: 'lobbying' } }),
    listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);