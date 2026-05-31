import { LineNode, LichessStudy, Puzzle } from "./types";

function instanceOfLichessStudy(object: any): object is LichessStudy {
    return "Event" in object;
}

export function parseLichessStudies(studies: any): Puzzle[] {
    const puzzles: Puzzle[] = [];
    for (const study of Object.values(studies)) {
        if (instanceOfLichessStudy(study)) {
            puzzles.push(parseLichessStudy(study));
        }
    }
    return puzzles;
}

export function parseLichessStudy(ls: LichessStudy): Puzzle {
    return {
        FEN: ls.FEN || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        title: ls.Event.substring(ls.Event.indexOf(":") + 2),
        pgn: parsePGN(ls.pgnContent),
        configOptions: { revealNextMove: ls.Site === "reveal all moves" }
    };
}

export function parsePGN(pgn: string): LineNode {
    const lineNode: LineNode = {
        move: null as any,
        nextNodes: [],
        comment: null,
        draws: null
    };
    let prevNode: LineNode = lineNode;
    let currNode = lineNode;
    let i = 0;

    while (i < pgn.length) {
        if (pgn.charAt(i) === "\n") {
            i++;
        }

        let j = i + 1;
        let specialCase: string | null = null;
        let remainingParensToSkip = 0;

        if (pgn.charAt(i) === "(") {
            remainingParensToSkip = 0;
            specialCase = ")";
        } else if (pgn.charAt(i) === "{") {
            specialCase = "}";
        }

        if (!specialCase) {
            while (pgn.charAt(j) !== " " && j < pgn.length) {
                j++;
            }

            const ch = pgn.charAt(j - 1);
            if (ch !== "." && ch !== "*" && ch !== "\n") {
                if (
                    !currNode.move ||
                    currNode.move.charAt(currNode.move.length - 1) !== "#"
                ) {
                    const nextNode: LineNode = {
                        move: pgn.substring(i, j),
                        nextNodes: [],
                        comment: null,
                        draws: null
                    };
                    currNode.nextNodes.push(nextNode);
                    prevNode = currNode;
                    currNode = nextNode;
                }
            }
        } else {
            while (j < pgn.length) {
                if (pgn.charAt(j) === "}" && specialCase === "}") {
                    break;
                } else if (pgn.charAt(j) === ")" && specialCase === ")") {
                    if (remainingParensToSkip > 0) {
                        remainingParensToSkip--;
                    } else {
                        break;
                    }
                } else if (pgn.charAt(j) === "(") {
                    remainingParensToSkip++;
                }
                j++;
            }

            if (pgn.charAt(j) === "}" && specialCase === "}") {
                if (pgn.charAt(i + 2) === "[") {
                    currNode.draws = pgn.substring(i + 2, j - 1);
                } else {
                    currNode.comment = pgn.substring(i + 2, j - 1).split("\n");
                }
                j++;
            } else if (pgn.charAt(j) === ")" && specialCase === ")") {
                const parsed = parsePGN(pgn.substring(i + 1, j));
                if (parsed.nextNodes[0]) {
                    prevNode.nextNodes.push(parsed.nextNodes[0]);
                }
                j++;
            }
        }

        i = j + 1;
        if (pgn.charAt(i) === " ") {
            i++;
        }
    }

    return lineNode;
}
