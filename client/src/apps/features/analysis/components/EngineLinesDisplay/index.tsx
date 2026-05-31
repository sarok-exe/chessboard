import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  StateTreeNode,
  addChildMove,
} from "shared/types/game/position/StateTreeNode";
import { pickEngineLines } from "shared/types/game/position/EngineLine";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import playBoardSound from "@/lib/boardSounds";

import * as styles from "./EngineLinesDisplay.module.css";

function traverseToLineMove(
  current: StateTreeNode,
  san: string,
  setter: (n: StateTreeNode) => void
) {
  const newNode = addChildMove(current, san);
  setter(newNode);
  playBoardSound(newNode);
}

function EngineLinesDisplay() {
  const { t } = useTranslation("analysis");

  const currentNode = useAnalysisBoardStore(
    state => state.currentStateTreeNode
  );
  const setCurrentNode = useAnalysisBoardStore(
    state => state.setCurrentStateTreeNode
  );

  const lines = useMemo(
    () =>
      pickEngineLines(currentNode.state.fen, currentNode.state.engineLines, {
        count: 2,
      }),
    [currentNode.state.fen, currentNode.state.engineLines]
  );

  if (!lines || lines.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <span className={styles.depth}>
        <span>{t("realtimeEngine.depth")}</span>
        <span>{lines[0].depth || 0}</span>
      </span>
      {lines.map((line, i) => (
        <React.Fragment key={line.index}>
          {i > 0 && <hr className={styles.separator} />}
          <div className={styles.line}>
            <span
              className={styles.evaluation}
              style={{
                backgroundColor:
                  line.evaluation.value >= 0 ? "#fff" : "#0c0c0c",
                color: line.evaluation.value >= 0 ? "#0c0c0c" : "#fff",
              }}
            >
              {line.evaluation.type === "centipawn"
                ? Math.abs(line.evaluation.value / 100).toFixed(2)
                : line.evaluation.value === 0
                  ? t("realtimeEngine.checkmate")
                  : `M${Math.abs(line.evaluation.value)}`}
            </span>
            {line.moves.map((move, mi) => (
              <span
                key={mi}
                className={styles.lineMove}
                onClick={() =>
                  traverseToLineMove(currentNode, move.san, setCurrentNode)
                }
              >
                {move.san}
              </span>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default EngineLinesDisplay;
