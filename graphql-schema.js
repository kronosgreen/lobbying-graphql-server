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
    Name: String!
    specificIssues: [SpecificIssue!]! @relationship(type: "MAIN_ISSUE", direction: IN)
}

type Person {
    Name: String!
    firmsWorked: [Firm!]! @relationship(type: "WORKED_AT", direction: OUT)
    firmsBoardAt: [Firm!]! @relationship(type: "BOARD_AT", direction: OUT)
}

extend schema @mutation(operations: [])
`;
