import React, { useState } from "react";

import PieceColour from "shared/constants/PieceColour";
import useGameLoader from "@analysis/hooks/useGameLoader";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import NavControls from "@analysis/components/NavControls";
import PlayerCard from "@analysis/components/PlayerCard";
import MoveHistory from "@analysis/components/MoveHistory";
import ActionButtons from "@analysis/components/ActionButtons";
import AnalysisPanel from "@analysis/components/AnalysisPanel";
import EngineLinesDisplay from "@analysis/components/EngineLinesDisplay";
import OptionsToolbar from "@analysis/components/OptionsToolbar";

import BoardArea from "./BoardArea";
import * as styles from "./Analysis.module.css";

type RightTab = "game-view" | "analysis";

function Analysis() {
    useGameLoader();

    const [activeTab, setActiveTab] = useState<RightTab>("game-view");

    const { analysisGame } = useAnalysisGameStore();

    useAnalysisBoardStore(state => state.currentStateTreeNodeUpdate);

    return (
        <div className={styles.wrapper}>
            <div className={styles.mainContent}>
                <div className={styles.leftPanel}>
                    <BoardArea/>
                    <NavControls isPrimary={true}/>
                    <OptionsToolbar/>
                </div>

                <div className={styles.rightPanel}>
                    <div className={styles.reviewHeader}>
                        <span className={styles.reviewIcon}>★</span>
                        <h2 className={styles.reviewTitle}>Game Review</h2>
                    </div>

                    <div className={styles.tabBar}>
                        <button
                            className={`${styles.tab} ${activeTab == "game-view" ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab("game-view")}
                        >
                            Game View
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab == "analysis" ? styles.tabActive : ""}`}
                            onClick={() => setActiveTab("analysis")}
                        >
                            Analysis
                        </button>
                    </div>

                    {activeTab == "game-view" ? (
                        <div className={styles.gameViewContent}>
                            <div className={styles.gameViewPlayers}>
                                <PlayerCard
                                    colour={PieceColour.WHITE}
                                    game={analysisGame}
                                />
                                <PlayerCard
                                    colour={PieceColour.BLACK}
                                    game={analysisGame}
                                />
                            </div>
                            <div className={styles.engineLinesSection}>
                                <EngineLinesDisplay/>
                            </div>
                            <MoveHistory/>
                            <ActionButtons/>
                        </div>
                    ) : (
                        <div className={styles.analysisTabContent}>
                            <AnalysisPanel/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Analysis;
