import React from "react";
import { stringifyEvaluation } from "shared/lib/utils/chess";
import { getTopEngineLine } from "shared/types/game/position/EngineLine";
import useRealtimeEngineStore from "@analysis/stores/RealtimeEngineStore";

import * as styles from "./SuggestionBubble.module.css";

function SuggestionBubble() {
    const displayedEngineLines = useRealtimeEngineStore(
        state => state.displayedEngineLines
    );

    const topLine = getTopEngineLine(displayedEngineLines);
    if (!topLine) return null;

    const bestMove = topLine.moves.at(0)?.san;
    const evaluationText = stringifyEvaluation(topLine.evaluation, true, 1);
    const scoreNum = parseFloat(evaluationText.replace(/[M+]/g, ""));

    let label = "best move";
    if (evaluationText.startsWith("M")) label = "forced mate";
    else if (Math.abs(scoreNum) >= 2) label = "winning move";
    else if (Math.abs(scoreNum) >= 1) label = "great move";

    const colour = scoreNum > 0 ? "#4ade80"
        : scoreNum < 0 ? "#f87171" : "#60a5fa";

    return (
        <div className={styles.bubble}>
            <div className={styles.icon}>
                <span className={styles.pieceIcon}>♟</span>
            </div>
            <p className={styles.text}>
                <strong>{bestMove}</strong> is the {label} in this position
            </p>
            <span className={styles.badge} style={{ color: colour }}>
                {evaluationText}
            </span>
        </div>
    );
}

export default SuggestionBubble;
