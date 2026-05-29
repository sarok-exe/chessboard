import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { trim } from "lodash-es";

import { Game, getColourPlayed } from "shared/types/game/Game";
import PieceColour from "shared/constants/PieceColour";
import {
    GameSource,
    GameSourceType,
    GameSelectorButton
} from "@/components/chess/GameSelector/GameSource";
import useGameSelector from "@/hooks/useGameSelector";
import useAnalysisBoardStore from "@/apps/features/analysis/stores/AnalysisBoardStore";
import Button from "@/components/common/Button";
import FileUploader from "@/components/common/FileUploader";
import GameSearchMenu from "../GameSearchMenu";

import GameSelectorProps from "./GameSelectorProps";
import * as styles from "./GameSelector.module.css";

const sourcePlaceholderKeys: Record<GameSourceType, string> = {
    PGN: "pgn",
    FEN: "fen",
    CHESS_COM: "chessCom",
    LICHESS: "lichess"
};

function GameSelector({
    style,
    saveLocalStorage,
    onGameSelect
}: GameSelectorProps) {
    const { t } = useTranslation("analysis");

    const {
        savedGameSource,
        setSavedGameSource,
        savedFieldInputs,
        setSavedFieldInput
    } = useGameSelector();

    const setBoardFlipped = useAnalysisBoardStore(
        state => state.setBoardFlipped
    );

    const [ gameSource, setGameSource ] = useState(
        saveLocalStorage ? savedGameSource : GameSource.PGN
    );

    const [
        fieldInputs,
        setFieldInputs
    ] = useState(saveLocalStorage ? savedFieldInputs : {});

    const currentFieldInput = useMemo(() => (
        fieldInputs[gameSource.key] || ""
    ), [gameSource.key, fieldInputs]);

    const [
        serviceGames,
        setServiceGames
    ] = useState<Record<string, Game | null>>({
        [GameSource.CHESS_COM.key]: null,
        [GameSource.LICHESS.key]: null
    });

    const [ searchMenuOpen, setSearchMenuOpen ] = useState(false);

    // Emit selected game when it updates
    useEffect(() => {
        if (gameSource.selectorButton == GameSelectorButton.SEARCH_GAMES) {
            return onGameSelect?.(serviceGames[gameSource.key]);
        }

        onGameSelect?.(currentFieldInput || null);
    }, [currentFieldInput, serviceGames]);

    function updateFieldInput(value: string) {
        const updatedFieldInputs = {
            ...fieldInputs,
            [gameSource.key]: value
        };

        setFieldInputs(updatedFieldInputs);

        if (!saveLocalStorage) return;
        setSavedFieldInput(gameSource.key, value);
    }

    function openGameSearchMenu() {
        if (currentFieldInput.length == 0) return;

        setSearchMenuOpen(true);
    }

    return <div className={styles.wrapper} style={style}>
        <div className={styles.inputHeader}>
            <select
                className={styles.sourceDropdown}
                onChange={event => {
                    const newGameSource = Object.values(GameSource).find(
                        source => source.key == event.target.value
                    ) || GameSource.PGN;

                    setGameSource(newGameSource);

                    if (!saveLocalStorage) return;
                    setSavedGameSource(newGameSource.key);
                }}
                value={gameSource.key}
            >
                {Object.values(GameSource)
                    .map(source => <option key={source.key} value={source.key}>
                        {source.title}
                    </option>)
                }
            </select>

            {gameSource.selectorButton == GameSelectorButton.UPLOAD_FILE
                && <FileUploader
                    extensions={[".pgn"]}
                    onFilesUpload={async files => {
                        const pgn = await files.item(0)?.text();
                        if (!pgn) return;

                        updateFieldInput(pgn);
                    }}
                >
                    <button className={styles.uploadBtn} type="button" title={t("gameSelector.uploadPGNButton")}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                    </button>
                </FileUploader>
            }
        </div>

        <textarea
            className={styles.selectorField}
            placeholder={t(
                "gameSelector.sourcePlaceholders."
                + sourcePlaceholderKeys[gameSource.key]
            )}
            style={{
                height: gameSource.expandField ? "170px" : "70px",
            }}
            value={currentFieldInput}
            onChange={event => updateFieldInput(event.target.value)}
            onKeyDown={event => {
                if (event.key != "Enter") return;
                if (
                    gameSource.selectorButton
                    != GameSelectorButton.SEARCH_GAMES
                ) return;

                event.preventDefault();
                openGameSearchMenu();
            }}
        />

        {gameSource.selectorButton == GameSelectorButton.SEARCH_GAMES
            && <Button
                className={styles.selectorButton}
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>}
                iconSize="18px"
                onClick={openGameSearchMenu}
            >
                {t("gameSelector.searchGamesButton")}
            </Button>
        }
        
        {searchMenuOpen && <GameSearchMenu
            username={trim(currentFieldInput)}
            gameSource={gameSource}
            onClose={() => setSearchMenuOpen(false)}
            onGameSelect={game => {
                setServiceGames({
                    ...serviceGames,
                    [gameSource.key]: game
                });

                const usersColour = getColourPlayed(
                    game, trim(currentFieldInput)
                );

                setBoardFlipped(usersColour == PieceColour.BLACK);
            }}
        />}
    </div>;
}

export default GameSelector;
