import React, { useEffect, useRef, useMemo } from "react";

import {
  StateTreeNode,
} from "shared/types/game/position/StateTreeNode";
import { Classification } from "shared/constants/Classification";
import { classificationColours } from "@analysis/constants/classifications";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import playBoardSound from "@/lib/boardSounds";

import * as styles from "./MoveHistory.module.css";

interface FlatMove {
  index: number;
  node: StateTreeNode;
  san: string;
  isWhite: boolean;
  classification?: Classification;
}

const PIECE_UNICODE: Record<string, [string, string]> = {
  K: ["♔", "♚"],
  Q: ["♕", "♛"],
  R: ["♖", "♜"],
  B: ["♗", "♝"],
  N: ["♘", "♞"],
  P: ["♙", "♟"],
};

function getPieceFromSan(san: string): string {
  if (san.startsWith("O")) return "K";
  const m = san.match(/^([KQRBN])/);
  return m ? m[1] : "P";
}

function getPieceUnicode(san: string, isWhite: boolean): string {
  const piece = getPieceFromSan(san);
  const pair = PIECE_UNICODE[piece];
  return pair ? pair[isWhite ? 0 : 1] : "?";
}

function buildFlatMoves(rootNode: StateTreeNode): FlatMove[] {
  const moves: FlatMove[] = [];
  let current = rootNode;
  let idx = 0;

  while (current.children.length > 0) {
    const child = current.children[0];
    const san = child.state.move?.san;
    if (!san) break;

    const moveColour = child.state.moveColour;
    const isWhite = moveColour == null || moveColour === "white";
    const halfMoveNumber = moves.length + 1;

    moves.push({
      index: idx++,
      node: child,
      san,
      isWhite,
      classification: child.state.classification,
    });

    current = child;
  }

  return moves;
}

function MoveHistory() {
  const { analysisGame } = useAnalysisGameStore();
  const {
    currentStateTreeNode,
    setCurrentStateTreeNode,
  } = useAnalysisBoardStore();

  const listRef = useRef<HTMLDivElement>(null);

  const flatMoves = useMemo(
    () => buildFlatMoves(analysisGame.stateTree),
    [analysisGame.stateTree]
  );

  const currentId = currentStateTreeNode.id;
  const activeIndex = flatMoves.findIndex(m => m.node.id === currentId);

  useEffect(() => {
    const activeEl = listRef.current?.querySelector(`.${styles.active}`);
    activeEl?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [currentId]);

  function goToNode(node: StateTreeNode) {
    setCurrentStateTreeNode(node);
    playBoardSound(node);
  }

  return (
    <div className={styles.section}>
      <h3 className={styles.title}>Move History</h3>
      <div className={styles.list} ref={listRef}>
        {flatMoves.map((m, i) => {
          const moveNumber = Math.floor(i / 2) + 1;
          const numLabel = m.isWhite
            ? `${moveNumber}.`
            : `${moveNumber}...`;

          const isActive = i === activeIndex;

          return (
            <div
              key={m.node.id}
              className={`${styles.row} ${isActive ? styles.active : ""}`}
              onClick={() => goToNode(m.node)}
            >
              <span className={styles.num}>{numLabel}</span>
              <span className={styles.piece}>
                {getPieceUnicode(m.san, m.isWhite)}
              </span>
              <span className={styles.san}>{m.san}</span>
              {m.classification && (
                <span
                  className={styles.classification}
                  style={{
                    color: classificationColours[m.classification],
                    backgroundColor:
                      classificationColours[m.classification] + "22",
                  }}
                >
                  {m.classification}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MoveHistory;
