import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import { typeDefs } from './graphql-schema.js';

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("graphql-client", "4k%ygEs$bcQL2VyuXPR7P*C%4exs#6ftKVv&9M^zSkpV6rZbjhnQsmcc%dm4Zf!S")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
});

console.log("Setting up server...");
const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => ({ req, sessionConfig: { database: 'opensecrets' } }),
    listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);