import { Move } from "chess.js";

import iconMove from "@assets/audio/move.mp3";
import iconCheck from "@assets/audio/check.mp3";
import iconCapture from "@assets/audio/capture.mp3";
import iconCastle from "@assets/audio/castle.mp3";
import iconPromote from "@assets/audio/promote.mp3";

function playSound(src: string) {
    try {
        new Audio(src).play();
    } catch {
        // silent fallback
    }
}

export function playPuzzleSound(move: Move) {
    if (move.san.includes("#") || move.san.includes("+")) {
        playSound(iconCheck);
    } else if (move.flags.includes("k") || move.flags.includes("q")) {
        playSound(iconCastle);
    } else if (move.flags.includes("p")) {
        playSound(iconPromote);
    } else if (move.captured) {
        playSound(iconCapture);
    } else {
        playSound(iconMove);
    }
}
