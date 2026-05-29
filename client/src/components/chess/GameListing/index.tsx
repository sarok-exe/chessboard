import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";
import { truncate, uniqueId } from "lodash-es";

import { GameResult, getOpinionatedGameResult } from "shared/constants/game/GameResult";
import TimeControl from "shared/constants/game/TimeControl";
import { formatDate } from "shared/lib/utils/date";
import GameListingMetadata from "./GameListingMetadata";
import Button from "@/components/common/Button";
import displayToast from "@/lib/toast";

import GameListingProps from "./GameListingProps";
import * as styles from "./GameListing.module.css";

const timeIcon = (path: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d={path} />
    </svg>
);

const timeControlIcons: Record<string, React.ReactNode> = {
    [TimeControl.BULLET]: timeIcon("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4-2.37V7z"),
    [TimeControl.BLITZ]: timeIcon("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4-2.37V7z"),
    [TimeControl.RAPID]: timeIcon("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4-2.37V7z"),
    [TimeControl.CLASSICAL]: timeIcon("M8.47 5.95C8.95 5.67 9.47 5.44 10 5.28V4c0-1.1.87-2 1.97-1.97C13.13 2 14 2.9 14 4v1.28c.53.17 1.05.39 1.53.67l-1.6 2.12H10.07L8.47 5.95zM19 12c0 .5-.05.95-.14 1.4l-2.53-.78-1.19-3.66 1.6-2.11c.43.4.81.85 1.14 1.35.79-.07 1.55.05 2.23.39C21.14 9.12 21.84 10.13 22 11.28L19 11.64V12zM5 12c0-.12 0-.24.01-.35L2 11.28c.16-1.15.86-2.16 1.89-2.69.68-.34 1.45-.46 2.19-.33.33-.51.71-.98 1.16-1.39l1.62 2.08-1.19 3.67-2.53.77C5.05 12.95 5 12.5 5 12z"),
    [TimeControl.CORRESPONDENCE]: timeIcon("M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6v-2zm0 4h8v2H6v-2zm10 0h2v2h-2v-2zm-6-4h8v2h-8v-2z")
};

const resultSvg = (path: string) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d={path} />
    </svg>
);

const gameResultIcons = {
    unopinionated: {
        [GameResult.WIN]: resultSvg("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"),
        [GameResult.DRAW]: resultSvg("M19 13H5v-2h14v2z"),
        [GameResult.LOSE]: resultSvg("M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"),
        [GameResult.UNKNOWN]: resultSvg("M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z")
    },
    opinionated: {
        [GameResult.WIN]: resultSvg("M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"),
        [GameResult.DRAW]: resultSvg("M19 13H5v-2h14v2z"),
        [GameResult.LOSE]: resultSvg("M12 2l-3.09 6.26L2 9.27l5 4.87-1.18 6.88L12 17.77l6.18 3.25L17 14.14 22 9.27l-6.91-1.01L12 2z"),
        [GameResult.UNKNOWN]: resultSvg("M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z")
    }
};

// Map of game results to their tooltip keys in translation file
const gameResultTooltipCodes = {
    [GameResult.WIN]: "win",
    [GameResult.DRAW]: "draw",
    [GameResult.LOSE]: "lose",
    [GameResult.UNKNOWN]: "unknown"
};

const maxProfileLength = 20;

function GameListing<T extends GameListingMetadata>({
    className,
    style,
    game,
    perspective,
    selected,
    onClick,
    onSelect
}: GameListingProps<T>) {
    const { t } = useTranslation("common");

    const displayResult = useMemo(() => {
        if (!game.players.white.result) return;

        return perspective
            ? getOpinionatedGameResult(
                game.players.white.result,
                perspective
            )
            : game.players.white.result;
    }, [game, perspective]);

    const listingId = useMemo(uniqueId, []);

    function copyPGN() {
        if (!game.pgn) return;

        navigator.clipboard.writeText(game.pgn);

        displayToast({
            message: t("shareGame.copyPGNToast"),
            theme: "success"
        });
    }

    return <div
        className={[
            styles.gameListing,
            onClick && styles.clickableListing,
            className
        ].join(" ")}
        style={style}
        onClick={() => onClick?.(game)}
    >
        {onSelect && <input
            className={styles.selector}
            type="checkbox"
            checked={selected}
            onChange={event => onSelect(event.target.checked, game)}
            onClick={event => event.stopPropagation()}
        />}
        
        {game.timeControl && <div style={{ width: "30px", display: "flex", alignItems: "center", justifyContent: "center" }} title={game.timeControl}>
            {timeControlIcons[game.timeControl]}
        </div>}

        <div style={{ width: "250px" }}>
            {Object.entries(game.players)
                .map(([ colour, player ]) => <div
                    className={styles.playerProfile}
                    key={colour}
                >
                    {player.title && <span className={styles.playerTitle}>
                        {player.title}
                    </span>}
                    
                    <div className={styles.usersColour} style={{
                        backgroundColor: player === game.players.white
                            ? "whitesmoke" : "black"
                    }}/>

                    <span>
                        {truncate(player.username, {
                            length: maxProfileLength
                                - (player.title?.length || 0)
                        })}
                    </span>
    
                    <span style={{ color: "grey" }}>
                        ({player.rating || "?"})
                    </span>
                </div>)
            }
        </div>

        <div style={{ width: "110px" }}>
            <span title={game.date?.toLocaleString()}>
                {game.date ? formatDate(new Date(game.date)) : t(
                    "gameListing.gameResults.opinionated.unknown"
                )}
            </span>
        </div>

        {displayResult && <div style={{ width: "20px" }}>
            <img
                src={perspective
                    ? gameResultIcons.opinionated[displayResult]
                    : gameResultIcons.unopinionated[displayResult]
                }
                title={t(
                    "gameListing.gameResults."
                    + (perspective ? "opinionated." : "unopinionated.")
                    + gameResultTooltipCodes[displayResult]
                )}
                style={{ width: "100%" }}
            />
        </div>}

        {game.pgn && <Button
            className={styles.copyButton}
            icon={<svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>}
            tooltipId={`game-listing-copy-${listingId}`}
            onClick={event => {
                event.stopPropagation();
                copyPGN();
            }}
        />}

        <Tooltip
            id={`game-listing-copy-${listingId}`}
            content={t("gameListing.copyPGN")}
            delayShow={500}
        />
    </div>;
}

export default GameListing;