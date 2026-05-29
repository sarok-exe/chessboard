import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Options as HotkeyOptions, useHotkeys } from "react-hotkeys-hook";

import { getNodeChain } from "shared/types/game/position/StateTreeNode";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import playBoardSound from "@/lib/boardSounds";

import StateTreeTraverserProps from "./StateTreeTraverserProps";
import * as styles from "./StateTreeTraverser.module.css";

type Interval = ReturnType<typeof setInterval>;

const hotkeyConfig: HotkeyOptions = { preventDefault: true };

function StateTreeTraverser({ className, style }: StateTreeTraverserProps) {
    const { t } = useTranslation("analysis");

    const { analysisGame } = useAnalysisGameStore();

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        autoplayEnabled,
        setAutoplayEnabled
    } = useAnalysisBoardStore();

    const autoplayIntervalRef = useRef<Interval>();

    useEffect(() => {
        if (autoplayEnabled) {
            traverseForwards();

            autoplayIntervalRef.current = setInterval(traverseForwards, 1000);
        } else {
            clearInterval(autoplayIntervalRef.current);
        }
    }, [autoplayEnabled]);

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

    useHotkeys("up, shift+left", traverseToBeginning, hotkeyConfig);
    useHotkeys("down, shift+right", traverseToEnd, hotkeyConfig);
    useHotkeys("left", traverseBackwards, hotkeyConfig);
    useHotkeys("right", traverseForwards, hotkeyConfig);

    return <div className={`${styles.wrapper} ${className}`} style={style}>
        <div
            className={styles.controlBtn}
            onClick={traverseToBeginning}
            title={t("stateTreeTraverser.beginning")}
        >
            <svg width={50} height={50} viewBox="0 -960 960 960" fill="currentColor">
                <path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z"/>
            </svg>
        </div>

        <div
            className={styles.controlBtn}
            onClick={traverseBackwards}
            title={t("stateTreeTraverser.back")}
        >
            <svg width={50} height={50} viewBox="0 -960 960 960" fill="currentColor">
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>
            </svg>
        </div>

        <div
            className={styles.autoplayContainer}
            onClick={() => setAutoplayEnabled(!autoplayEnabled)}
            title={autoplayEnabled
                ? t("stateTreeTraverser.pause")
                : t("stateTreeTraverser.play")
            }
        >
            {autoplayEnabled
                ? <svg width={50} height={50} viewBox="0 -960 960 960" fill="currentColor">
                    <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Z"/>
                </svg>
                : <svg width={50} height={50} viewBox="0 -960 960 960" fill="currentColor">
                    <path d="M320-200v-560l440 280-440 280Z"/>
                </svg>
            }
        </div>

        <div
            className={styles.controlBtn}
            onClick={traverseForwards}
            title={t("stateTreeTraverser.next")}
        >
            <svg width={50} height={50} viewBox="0 -960 960 960" fill="currentColor">
                <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/>
            </svg>
        </div>

        <div
            className={styles.controlBtn}
            onClick={traverseToEnd}
            title={t("stateTreeTraverser.end")}
        >
            <svg width={50} height={50} viewBox="0 -960 960 960" fill="currentColor">
                <path d="m280-240-56-56 184-184-184-184 56-56 240 240-240 240Zm360 0v-480h80v480h-80Z"/>
            </svg>
        </div>
    </div>;
}

export default StateTreeTraverser;
