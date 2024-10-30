export const typeDefs = `#graphql
type Firm {
    Name: String!
    lobbyingRecords: [LobbyingRecord!]! @relationship(type: "CLIENT", direction: IN)
    lobbyingRecordsRegistrant: [LobbyingRecord!]! @relationship(type: "REGISTRANT_ON", direction: OUT)
    subsidiaries: [Firm!]! @relationship(type: "PARENT_OF", direction: OUT)
    parent: Firm @relationship(type: "PARENT_OF", direction: IN)
    categories: [Category!]! @relationship(type: "IS_IN_CATEGORY", direction: OUT)
    worked: [Person!]! @relationship(type: "WORKED_AT", direction: IN)
    board: [Person!]! @relationship(type: "BOARD_AT", direction: IN)
}

extend type Firm {
    lobbyingRecordsByYear(year: Int): [LobbyingRecord!]!
    totalLobbyingYear(year: Int): Float @cypher(statement:"""
            MATCH (this)<-[:CLIENT]-(lr:LobbyingRecord)
            WHERE lr.Year = $year
            RETURN SUM(lr.Amount) AS total
        """,
        columnName: "total")
    sectors: [String] @cypher(statement: """
            MATCH (this)-[:IS_IN_CATEGORY]->(:Category)-[:IS_IN_INDUSTRY]->(:Industry)-[:IS_IN_SECTOR]->(s:Sector)
            RETURN DISTINCT s.Name AS sectors
    """, columnName: "sectors")
    industries: [String] @cypher(statement: """
            MATCH (this)-[:IS_IN_CATEGORY]->(:Category)-[:IS_IN_INDUSTRY]->(i:Industry)
            RETURN DISTINCT i.Name AS industries
    """, columnName: "industries")
    issuesLobbied(year: Int): [String] @cypher(statement: """
            MATCH (this)<-[:CLIENT]-(lr:LobbyingRecord)-[:CONCERNS]->(si:SpecificIssue)-[:MAIN_ISSUE]->(i:Issue)
            WHERE lr.Year = $year
            RETURN DISTINCT i.Issue AS issues
    """, columnName: "issues")
    agenciesLobbied(year: Int): [String] @cypher(statement: """
            MATCH (this)<-[:CLIENT]-(lr:LobbyingRecord)-[:LOBBIED_AT]->(a:Agency)
            WHERE lr.Year = $year
            RETURN DISTINCT a.Name AS agencies
    """, columnName: "agencies")
}

type LobbyingRecord {
    Uniqid: String!
    IsFirm: Boolean
    Amount: Float
    Source: String
    Self: String
    Year: Int
    Type: String
    Use: Boolean
    IncludeNSFS: Boolean
    Ind: Boolean
    Affiliate: Boolean
    client: Firm! @relationship(type: "CLIENT", direction: OUT)
    registrant: Firm! @relationship(type: "REGISTRANT_ON", direction: IN)
    specificIssue: [SpecificIssue!]! @relationship(type: "CONCERNS", direction: OUT)
    agenciesLobbied: [Agency!]! @relationship(type: "LOBBIED_AT", direction: OUT)
}

type Category {
    Name: String!
    firms: [Firm!]! @relationship(type: "IS_IN_CATEGORY", direction: IN)
    industry: Industry! @relationship(type: "IS_IN_INDUSTRY", direction: OUT)
}

type Industry {
    Name: String!
    categories: [Category!]! @relationship(type: "IS_IN_INDUSTRY", direction: IN)
    sector: Sector! @relationship(type: "IS_IN_SECTOR", direction: OUT)
}

type Sector {
    Name: String!
    SectorLong: String
    industries: [Industry!]! @relationship(type: "IS_IN_SECTOR", direction: IN)
}

type Agency {
    ID: String!
    Name: String!
    lobbiedBy: [LobbyingRecord!]! @relationship(type: "LOBBIED_AT", direction: IN)
}

type SpecificIssue {
    SI_ID: Int!
    SpecificIssue: String!
    Year: Int
    lobbyingRecords: [LobbyingRecord!]! @relationship(type: "CONCERNS", direction: IN)
    issue: Issue! @relationship(type: "MAIN_ISSUE", direction: OUT)
}

type Issue {
    IssueID: String!
    Issue: String!
    specificIssues: [SpecificIssue!]! @relationship(type: "MAIN_ISSUE", direction: IN)
}

type Person {
    Name: String!
    firmsWorked: [Firm!]! @relationship(type: "WORKED_AT", direction: OUT)
    firmsBoardAt: [Firm!]! @relationship(type: "BOARD_AT", direction: OUT)
}

type Query {
    TopSpendingFirms(year: Int, minSpent: Float, options: FirmOptions): [Firm] @cypher(statement: """
        MATCH (f:Firm)<-[:CLIENT]-(lr:LobbyingRecord)
        WHERE lr.Year = $year
        WITH f, SUM(lr.Amount) AS total
        WHERE total > $minSpent
        RETURN f
        SKIP $options.offset
        LIMIT $options.limit""", columnName: "f")
    TopFirmsCount(year: Int, minSpent: Float): Int! @cypher(statement: """
        MATCH (f:Firm)<-[:CLIENT]-(lr:LobbyingRecord)
        WHERE lr.Year = $year
        WITH f, SUM(lr.Amount) AS total
        WHERE total > $minSpent
        RETURN COUNT(f) AS count
    """, columnName: "count")
}

extend schema @mutation(operations: [])
`;
