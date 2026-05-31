export interface LichessStudy {
    Event: string;
    Site: string;
    Result: string;
    UTCDate: string;
    UTCTime: string;
    Variant: string;
    ECO: string;
    Opening: string;
    Annotator: string;
    FEN?: string;
    SetUp?: string;
    pgnContent: string;
}

export interface LineNode {
    move: string;
    nextNodes: LineNode[];
    comment: string[] | null;
    draws: string | null;
}

export interface Puzzle {
    FEN: string;
    pgn: LineNode;
    beginAt?: LineNode;
    title: string;
    configOptions?: { revealNextMove: boolean };
}
