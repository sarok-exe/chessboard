import { Puzzle } from "./types";
import { parseLichessStudies } from "./pgnParser";

import endgameCheckmatesData from "./data/endgame_checkmates.json";
import queenEndgamesData from "./data/queen_endgames.json";
import pawnEndgamesData from "./data/pawn_endgames.json";
import rookEndgamePrinciplesData from "./data/rook_endgame_principles.json";
import lucenaPhilidorVancuraData from "./data/lucena_philidor_and_vancura.json";
import rookVsOnePawnData from "./data/rook_vs_one_pawn.json";
import rookVsTwoPawnsData from "./data/rook_vs_two_pawns.json";
import rookEndgames1v1_2v3Data from "./data/rook_endgames_1v1_2v3.json";
import rookEndgames4v3Data from "./data/rook_endgames_4v3.json";
import rookEndgameExercisesData from "./data/rook_endgame_exercises.json";
import ruyLopezData from "./data/ruy_lopez.json";
import ruyLopezClosedData from "./data/ruy_lopez_closed.json";
import najdorfData from "./data/najdorf.json";

export interface CourseInfo {
    key: string;
    name: string;
    description: string;
}

export const COURSES: CourseInfo[] = [
    { key: "endgame_checkmates", name: "Endgame Checkmates", description: "Practice simple endgame patterns" },
    { key: "pawn_endgames", name: "Pawn Endgames", description: "Learn ideas about pawn endgames" },
    { key: "queen_endgames", name: "Queen Endgames", description: "Practice endgames with queens" },
    { key: "rook_endgame_principles", name: "Rook Endgame Principles", description: "Understand critical ideas in rook endgames" },
    { key: "lucena_philidor_and_vancura", name: "Lucena, Philidor & Vancura", description: "Essential rook endgames" },
    { key: "rook_vs_one_pawn", name: "Rook vs. One Pawn", description: "Winning with a rook vs a single pawn" },
    { key: "rook_vs_two_pawns", name: "Rook vs. Two Pawns", description: "Drawing with a rook against two connected pawns" },
    { key: "rook_endgames_1v1_2v3", name: "Rook Endgames: 1v1 & 2v3", description: "Drawing and winning with rook and pawns" },
    { key: "rook_endgames_4v3", name: "Rook Endgames: 4v3", description: "Winning techniques with multiple pawns" },
    { key: "rook_endgame_exercises", name: "Rook Endgame Exercises", description: "Miscellaneous rook endgame practice" },
    { key: "ruy_lopez", name: "Ruy Lopez", description: "Main lines of the Ruy Lopez opening" },
    { key: "ruy_lopez_closed", name: "Ruy Lopez Closed", description: "Closed lines of the Ruy Lopez" },
    { key: "najdorf", name: "Sicilian: Najdorf", description: "Main lines of the Sicilian Najdorf" },
];

const studyObjects: Record<string, any> = {
    endgame_checkmates: (endgameCheckmatesData as any).endgame_checkmates,
    queen_endgames: (queenEndgamesData as any).queen_endgames,
    pawn_endgames: (pawnEndgamesData as any).pawn_endgames,
    rook_endgame_principles: (rookEndgamePrinciplesData as any).rook_endgame_principles,
    lucena_philidor_and_vancura: (lucenaPhilidorVancuraData as any).lucena_philidor_and_vancura,
    rook_vs_one_pawn: (rookVsOnePawnData as any).rook_vs_one_pawn,
    rook_vs_two_pawns: (rookVsTwoPawnsData as any).rook_vs_two_pawns,
    rook_endgames_1v1_2v3: (rookEndgames1v1_2v3Data as any).rook_endgames_1v1_2v3,
    rook_endgames_4v3: (rookEndgames4v3Data as any).rook_endgames_4v3,
    rook_endgame_exercises: (rookEndgameExercisesData as any).rook_endgame_exercises,
    ruy_lopez: (ruyLopezData as any).ruy_lopez,
    ruy_lopez_closed: (ruyLopezClosedData as any).ruy_lopez_closed,
    najdorf: (najdorfData as any).najdorf,
};

export function loadCourse(courseKey: string): Puzzle[] {
    const data = studyObjects[courseKey];
    if (!data) return [];
    return parseLichessStudies(data);
}
