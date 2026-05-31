import React, { useState, useEffect } from "react";

import PieceColour from "shared/constants/PieceColour";
import useGameLoader from "@analysis/hooks/useGameLoader";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useSettingsStore from "@/stores/SettingsStore";
import useNavigationStore from "@analysis/stores/NavigationStore";
import useAuthStore from "@/stores/AuthStore";
import NavControls from "@analysis/components/NavControls";
import PlayerCard from "@analysis/components/PlayerCard";
import MoveHistory from "@analysis/components/MoveHistory";
import ActionButtons from "@analysis/components/ActionButtons";
import AnalysisPanel from "@analysis/components/AnalysisPanel";
import EngineLinesDisplay from "@analysis/components/EngineLinesDisplay";
import OptionsToolbar from "@analysis/components/OptionsToolbar";
import RealtimeEngineArea from "@analysis/components/AnalysisPanel/RealtimeEngineArea";
import Sidebar from "@analysis/components/Sidebar";
import PuzzlesView from "@analysis/components/Puzzles";
import LoginPage from "@/components/Auth/LoginPage";
import GameHistory from "@analysis/components/GameHistory";

import BoardArea from "./BoardArea";
import * as styles from "./Analysis.module.css";

type RightTab = "game-view" | "analysis";

function Analysis() {
    useGameLoader();

    const [activeTab, setActiveTab] = useState<RightTab>("game-view");
    const activeView = useNavigationStore(s => s.activeView);
    const setActiveView = useNavigationStore(s => s.setActiveView);
    const user = useAuthStore(s => s.user);

    useEffect(() => {
        if (user && activeView === "login") setActiveView("game-view");
    }, [user, activeView, setActiveView]);

    const { analysisGame, gameAnalysisOpen } = useAnalysisGameStore();
    const engineEnabled = useSettingsStore(
        state => state.settings.analysis.engine.enabled
    );

    useAnalysisBoardStore(state => state.currentStateTreeNodeUpdate);

    if (activeView === "puzzles") {
        return (
            <div className={styles.withSidebar}>
                <Sidebar/>
                <main className={styles.sidebarContent}>
                    <PuzzlesView/>
                </main>
            </div>
        );
    }

    if (activeView === "login") {
        return (
            <div className={styles.withSidebar}>
                <Sidebar/>
                <main className={styles.sidebarContent}>
                    <LoginPage/>
                </main>
            </div>
        );
    }

    if (activeView === "profile") {
        return (
            <div className={styles.withSidebar}>
                <Sidebar/>
                <main className={styles.sidebarContent}>
                    <GameHistory/>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.withSidebar}>
            <Sidebar/>
            <main className={styles.sidebarContent}>
                <div className={styles.wrapper}>
                    <div className={styles.mainContent}>
                        <div className={styles.leftPanel}>
                            <BoardArea/>
                            <NavControls isPrimary={true}/>
                            <OptionsToolbar/>
                        </div>

                        <div className={styles.rightPanel}>
                            {activeTab == "game-view" && gameAnalysisOpen && engineEnabled && (
                                <div className={styles.hiddenEngine}>
                                    <RealtimeEngineArea/>
                                </div>
                            )}

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
            </main>
        </div>
    );
}

export default Analysis;
