import React, { useEffect, useRef } from "react";
import { getNodeChain } from "shared/types/game/position/StateTreeNode";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import playBoardSound from "@/lib/boardSounds";

import * as styles from "./NavControls.module.css";

type Interval = ReturnType<typeof setInterval>;

interface NavControlsProps {
    isPrimary?: boolean;
}

function NavControls({ isPrimary = false }: NavControlsProps) {
    const { analysisGame } = useAnalysisGameStore();

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        autoplayEnabled,
        setAutoplayEnabled
    } = useAnalysisBoardStore();

    const autoplayIntervalRef = useRef<Interval>();

    useEffect(() => {
        if (!isPrimary) return;
        if (autoplayEnabled) {
            traverseForwards();
            autoplayIntervalRef.current = setInterval(traverseForwards, 500);
        } else {
            clearInterval(autoplayIntervalRef.current);
        }
        return () => clearInterval(autoplayIntervalRef.current);
    }, [autoplayEnabled, isPrimary]);

    function traverseToBeginning() {
        setCurrentStateTreeNode(analysisGame.stateTree);
        setAutoplayEnabled(false);
    }

    function traverseToEnd() {
        const finalNode = getNodeChain(analysisGame.stateTree).at(-1)
            || analysisGame.stateTree;
        setCurrentStateTreeNode(finalNode);
        playBoardSound(finalNode);
        setAutoplayEnabled(false);
    }

    function traverseBackwards() {
        if (!currentStateTreeNode.parent) return;
        setCurrentStateTreeNode(currentStateTreeNode.parent);
        playBoardSound(currentStateTreeNode);
        setAutoplayEnabled(false);
    }

    function traverseForwards() {
        setCurrentStateTreeNode(currentNode => {
            const priorityChild = currentNode.children.at(0);
            if (priorityChild) {
                playBoardSound(priorityChild);
                return priorityChild;
            } else {
                setAutoplayEnabled(false);
                return currentNode;
            }
        });
    }

    function togglePlay() {
        setAutoplayEnabled(!autoplayEnabled);
    }

    return (
        <div className={styles.controls}>
            <button className={styles.ctrlBtn} onClick={traverseToBeginning} title="First move">
                ⏮
            </button>
            <button className={styles.ctrlBtn} onClick={traverseBackwards} title="Previous move">
                ◀
            </button>
            <button className={`${styles.ctrlBtn} ${styles.primaryBtn}`} onClick={togglePlay} title="Play/Pause">
                {autoplayEnabled ? "⏸" : "▶"}
            </button>
            <button className={styles.ctrlBtn} onClick={traverseForwards} title="Next move">
                ▶
            </button>
            <button className={styles.ctrlBtn} onClick={traverseToEnd} title="Last move">
                ⏭
            </button>
        </div>
    );
}

export default NavControls;
