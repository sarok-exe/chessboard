import React, { useMemo } from "react";
import { round } from "lodash-es";

import PieceColour from "shared/constants/PieceColour";
import { getGameAccuracy } from "shared/lib/reporter/accuracy";
import AnalysedGame from "shared/types/game/AnalysedGame";

import * as styles from "./PlayerCard.module.css";

interface PlayerCardProps {
    colour: PieceColour;
    game: AnalysedGame;
}

const ringCircumference = 201;

function PlayerCard({ colour, game }: PlayerCardProps) {
    const player = colour == PieceColour.WHITE
        ? game.players.white : game.players.black;

    const accuracy = useMemo(() => {
        const accuracies = getGameAccuracy(game.stateTree);
        return colour == PieceColour.WHITE ? accuracies.white : accuracies.black;
    }, [game.stateTree]);

    const accuracyPct = accuracy != null && !isNaN(accuracy)
        ? round(Math.max(0, Math.min(100, accuracy)), 0) : 0;

    const dashOffset = ringCircumference - (
        ringCircumference * accuracyPct / 100
    );

    const avatarImg = player.image;
    const ringClass = colour == PieceColour.WHITE
        ? styles.whiteRing : styles.blackRing;

    return (
        <div className={styles.card}>
            <div className={styles.info}>
                <div className={`${styles.avatar} ${
                    colour == PieceColour.WHITE
                        ? styles.whiteAvatar : styles.blackAvatar
                }`}>
                    {avatarImg
                        ? <img className={styles.avatarImg} src={avatarImg} alt={player.username} />
                        : <span>{colour == PieceColour.WHITE ? "♔" : "♚"}</span>
                    }
                </div>
                <div className={styles.meta}>
                    <span className={styles.name}>
                        {player.username || (colour == PieceColour.WHITE ? "White" : "Black")}
                    </span>
                    {player.rating != null && (
                        <span className={styles.rating}>{player.rating}</span>
                    )}
                </div>
            </div>

            <div className={styles.accuracyRing}>
                <svg className={styles.ringSvg} viewBox="0 0 80 80">
                    <circle className={styles.ringBg} cx="40" cy="40" r="32" />
                    <circle
                        className={`${styles.ringFill} ${ringClass}`}
                        cx="40" cy="40" r="32"
                        strokeDasharray={String(ringCircumference)}
                        strokeDashoffset={String(dashOffset)}
                    />
                </svg>
                <span className={styles.accuracyValue}>{accuracyPct}%</span>
            </div>
        </div>
    );
}

export default PlayerCard;
