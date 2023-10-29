export const typeDefs = `#graphql
type Firm {
    name: String
    cat: String
    catSource: String
    lobbying_activity: [LobbyingRecord!]! @relationship(type: "CLIENT", direction: IN)
    industry: Industry! @relationship(type: "BELONGS_TO", direction: OUT)
}

type Industry {
    industry: String
    name: String
    sector: String
    firms: [Firm!]! @relationship(type: "BELONGS_TO", direction: IN)
}

type LobbyingRecord {
    id: String
    client: [Firm!]! @relationship(type: "CLIENT", direction: OUT)
}

extend schema @mutation(operations: [])
`;