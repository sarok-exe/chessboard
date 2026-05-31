import React, { useCallback } from "react";
import { Move } from "chess.js";

import { addChildMove } from "shared/types/game/position/StateTreeNode";
import AnalysisTab from "@analysis/constants/AnalysisTab";
import useSettingsStore from "@/stores/SettingsStore";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisTabStore from "@analysis/stores/AnalysisTabStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import Board from "@analysis/components/Board";
import playBoardSound from "@/lib/boardSounds";

import useEvaluation from "./useEvaluation";
import useSuggestionArrows from "./useSuggestionArrows";
import * as styles from "./BoardArea.module.css";

function BoardArea() {
    const settings = useSettingsStore(state => state.settings.analysis);
    const theme = useSettingsStore(state => state.settings.themes);

    const {
        analysisGame,
        gameAnalysisOpen,
        setGameAnalysisOpen
    } = useAnalysisGameStore();

    const setActiveTab = useAnalysisTabStore(state => state.setActiveTab);

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        dispatchCurrentNodeUpdate,
        autoplayEnabled,
        boardFlipped
    } = useAnalysisBoardStore();

    const evaluation = useEvaluation();
    const suggestionArrows = useSuggestionArrows();

    const addMove = useCallback((move: Move) => {
        if (!gameAnalysisOpen) {
            setGameAnalysisOpen(true);
            setActiveTab(AnalysisTab.ANALYSIS);
        }

        setCurrentStateTreeNode(prev => {
            const createdNode = addChildMove(prev, move.san);
            playBoardSound(createdNode);

            return createdNode;
        });

        dispatchCurrentNodeUpdate();

        return true;
    }, [gameAnalysisOpen, setGameAnalysisOpen, setActiveTab, setCurrentStateTreeNode, dispatchCurrentNodeUpdate]);

    return (
        <div className={styles.boardWrapper}>
            <Board
                className={styles.board}
                whiteProfile={analysisGame.players.white}
                blackProfile={analysisGame.players.black}
                theme={{
                    lightSquareColour: theme.board.lightSquareColour,
                    darkSquareColour: theme.board.darkSquareColour
                }}
                node={currentStateTreeNode}
                flipped={boardFlipped}
                evaluation={evaluation}
                arrows={suggestionArrows}
                piecesDraggable={!autoplayEnabled}
                enableClassifications={!settings.classifications.hide}
                onAddMove={addMove}
            />
        </div>
    );
}

export default BoardArea;
