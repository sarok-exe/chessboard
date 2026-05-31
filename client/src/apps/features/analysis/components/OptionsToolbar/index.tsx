import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import { useShallow } from "zustand/react/shallow";
import { cloneDeep, omit } from "lodash-es";

import { defaultAnalysedGame } from "shared/constants/utils";
import AnalysisStatus from "@analysis/constants/AnalysisStatus";
import useAnalysisProgressStore from "../../stores/AnalysisProgressStore";
import { useAnalysisGameStore } from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useRealtimeEngineStore from "@analysis/stores/RealtimeEngineStore";
import Button from "@/components/common/Button";
import ShareDialog from "../ShareDialog";

import * as styles from "./OptionsToolbar.module.css";

function OptionsToolbar() {
    const { t } = useTranslation(["analysis", "common"]);

    const [ searchParams, setSearchParams ] = useSearchParams();

    const {
        evaluationController,
        setAnalysisStatus,
        setAnalysisError
    } = useAnalysisProgressStore(
        useShallow(state => ({
            evaluationController: state.evaluationController,
            setAnalysisStatus: state.setAnalysisStatus,
            setAnalysisError: state.setAnalysisError
        }))
    );

    const {
        analysisGame,
        setAnalysisGame,
        gameAnalysisOpen,
        setGameAnalysisOpen
    } = useAnalysisGameStore();

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        boardFlipped,
        setBoardFlipped
    } = useAnalysisBoardStore();

    const setDisplayedEngineLines = useRealtimeEngineStore(
        state => state.setDisplayedEngineLines
    );

    const [ shareOpen, setShareOpen ] = useState(false);

    function back() {
        setSearchParams(omit(
            Object.fromEntries(searchParams.entries()),
            ["game"]
        ));

        // Abort any ongoing evaluations or analyses
        evaluationController?.abort();

        setAnalysisStatus(AnalysisStatus.INACTIVE);
        setAnalysisError();

        // Reset analysis game & evaluation bar
        const freshAnalysisGame = cloneDeep(defaultAnalysedGame);

        setGameAnalysisOpen(false);
        setAnalysisGame(freshAnalysisGame);
        setCurrentStateTreeNode(freshAnalysisGame.stateTree);
        setDisplayedEngineLines([]);
    }

    return <>
        <div className={styles.wrapper}>
            {gameAnalysisOpen && <Button
                icon={<svg width="30" height="30" viewBox="0 -960 960 960" fill="currentColor"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>}
                iconSize={"40px"}
                className={styles.backButton}
                tooltipId={"options-toolbar-back"}
                onClick={back}
            />}

            <Tooltip
                id="options-toolbar-back"
                content={t("back", { ns: "common" })}
                delayShow={500}
            />

            <Button
                className={styles.optionButton}
                icon={<svg width="30" height="30" viewBox="0 -960 960 960" fill="currentColor"><path d="M160-160v-80h110l-16-14q-52-46-73-105t-21-119q0-111 66.5-197.5T400-790v84q-72 26-116 88.5T240-478q0 45 17 87.5t53 78.5l10 10v-98h80v240H160Zm400-10v-84q72-26 116-88.5T720-482q0-45-17-87.5T650-648l-10-10v98h-80v-240h240v80H690l16 14q49 49 71.5 106.5T800-482q0 111-66.5 197.5T560-170Z"/></svg>}
                iconSize={"40px"}
                tooltipId={"options-toolbar-flip"}
                onClick={() => setBoardFlipped(!boardFlipped)}
            />

            <Tooltip
                id="options-toolbar-flip"
                content={t("optionsToolbar.flipBoard")}
                delayShow={500}
            />

            <Button
                className={styles.optionButton}
                icon={<svg width="26" height="26" viewBox="0 -960 960 960" fill="currentColor"><path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z"/></svg>}
                iconSize={"35px"}
                tooltipId={"options-toolbar-share"}
                onClick={() => setShareOpen(true)}
            />

            <Tooltip
                id="options-toolbar-share"
                content={t("optionsToolbar.share")}
                delayShow={500}
            />

        </div>

        {shareOpen && <ShareDialog
            game={analysisGame}
            currentNode={currentStateTreeNode}
            onClose={() => setShareOpen(false)}
        />}
    </>;
}

export default OptionsToolbar;
