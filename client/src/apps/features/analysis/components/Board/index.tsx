import React, { useRef, useCallback, useEffect, useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import type { Square, Piece } from "react-chessboard/dist/chessboard/types";
import { defaultRootNode } from "shared/constants/utils";
import PlayerProfile from "@/components/chess/PlayerProfile";
import EvaluationBar from "../EvaluationBar";
import { BoardContext } from "./BoardContext";
import { useSquares } from "./squares/useSquares";
import { SquaresContext } from "./squares/SquaresContext";
import { customSquareRenderer } from "./squares/SquareRenderer";
import BoardProps from "./BoardProps";
import * as styles from "./Board.module.css";

function findKingSquare(fen: string, color: "w" | "b"): Square | null {
    const game = new Chess(fen);
    const board = game.board();
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            const p = board[r][f];
            if (p && p.type === "k" && p.color === color) {
                return ("abcdefgh"[f] + (8 - r)) as Square;
            }
        }
    }
    return null;
}

function boardTurn(fen: string): "w" | "b" {
    return fen.split(" ")[1] as "w" | "b";
}

function Board({
    className,
    style,
    profileClassName,
    profileStyle,
    whiteProfile,
    blackProfile,
    theme,
    piecesDraggable = true,
    node = defaultRootNode,
    flipped,
    evaluation,
    arrows,
    enableClassifications = true,
    onAddMove
}: BoardProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [boardWidth, setBoardWidth] = useState(400);
    const nodeRef = useRef(node);
    nodeRef.current = node;
    const onAddMoveRef = useRef(onAddMove);
    onAddMoveRef.current = onAddMove;

    const squares = useSquares();

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                setBoardWidth(entry.contentRect.width);
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    const handlePieceDragBegin = useCallback((
        piece: Piece,
        sourceSquare: Square
    ) => {
        const n = nodeRef.current;
        squares.loadPlayable(n.state.fen, sourceSquare);
    }, [squares]);

    const handlePieceDragEnd = useCallback(() => {
        squares.clearPlayable();
    }, [squares]);

    const handlePieceDrop = useCallback((
        sourceSquare: Square,
        targetSquare: Square,
        piece: Piece
    ) => {
        squares.clearPlayable();
        const n = nodeRef.current;
        try {
            const game = new Chess(n.state.fen);
            const move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q"
            });
            if (move) {
                onAddMoveRef.current?.(move);
                return true;
            }
        } catch {
            return false;
        }
        return false;
    }, [squares]);

    const handleSquareClick = useCallback((
        square: Square,
        piece: Piece | undefined
    ) => {
        const n = nodeRef.current;

        if (!squares.selected && piece) {
            const pieceColour = piece.charAt(0);
            const turn = boardTurn(n.state.fen);
            if (pieceColour !== turn) return;

            squares.setSelected(square);
            squares.loadPlayable(n.state.fen, square);
        } else if (squares.selected) {
            const game = new Chess(n.state.fen);
            try {
                const move = game.move({
                    from: squares.selected,
                    to: square,
                    promotion: "q"
                });
                if (move) {
                    squares.setSelected(undefined);
                    squares.clearPlayable();
                    onAddMoveRef.current?.(move);
                }
            } catch {
                squares.setSelected(undefined);
                squares.clearPlayable();
            }
        }
    }, [squares]);

    const handleSquareRightClick = useCallback((square: Square) => {
        squares.toggleHighlight(square);
    }, [squares]);

    const customSquareStyles = useMemo((): Record<string, Record<string, string | number>> => {
        const result: Record<string, Record<string, string | number>> = {};
        const n = nodeRef.current;

        const game = new Chess(n.state.fen);
        if (game.isCheck()) {
            const kingSquare = findKingSquare(n.state.fen, game.turn());
            if (kingSquare) {
                result[kingSquare] = {
                    boxShadow: "inset 0 0 15px 5px rgba(231,76,60,0.7)"
                };
            }
        }

        return result;
    }, [node.state.fen]);

    const customArrows = useMemo(() => {
        if (!arrows || arrows.length === 0) return undefined;
        return arrows as [Square, Square, string][];
    }, [arrows]);

    const boardOrientation = flipped ? "black" : "white";

    const lightColor = theme?.lightSquareColour || "#ebecd0";
    const darkColor = theme?.darkSquareColour || "#b58863";

    return (
        <div className={`${styles.wrapper} ${className}`} style={style}>
            <div className={styles.boardContainer}>
                {evaluation && (
                    <EvaluationBar
                        evaluation={evaluation}
                        moveColour={node.state.moveColour}
                        flipped={flipped}
                    />
                )}
                <div ref={containerRef} style={{ flex: 1, aspectRatio: "1 / 1" }}>
                    <BoardContext.Provider value={{ node, enableClassifications }}>
                        <SquaresContext.Provider value={squares}>
                            <Chessboard
                                id="analysis-board"
                                position={node.state.fen || "start"}
                                boardOrientation={boardOrientation}
                                boardWidth={boardWidth}
                                arePiecesDraggable={piecesDraggable}
                                onPieceDrop={handlePieceDrop}
                                onPieceDragBegin={handlePieceDragBegin}
                                onPieceDragEnd={handlePieceDragEnd}
                                onSquareClick={handleSquareClick}
                                onSquareRightClick={handleSquareRightClick}
                                customSquare={customSquareRenderer}
                                customSquareStyles={customSquareStyles}
                                customArrows={customArrows}
                                customLightSquareStyle={{ backgroundColor: lightColor }}
                                customDarkSquareStyle={{ backgroundColor: darkColor }}
                                customBoardStyle={{
                                    borderRadius: "0"
                                }}
                                showBoardNotation={true}
                                animationDuration={200}
                                autoPromoteToQueen={true}
                            />
                        </SquaresContext.Provider>
                    </BoardContext.Provider>
                </div>
            </div>
            {/* bottom profiles disabled
            <div className={`${styles.bottomProfiles} ${profileClassName}`}>
                {whiteProfile && (
                    <div className={styles.profileBlock} style={{ borderRadius: "0 0 0 7px" }}>
                        <PlayerProfile profile={whiteProfile} />
                    </div>
                )}
                {blackProfile && (
                    <div className={styles.profileBlock} style={{ borderRadius: "0 0 7px 0" }}>
                        <PlayerProfile profile={blackProfile} />
                    </div>
                )}
            </div>
            */}
        </div>
    );
}

export default Board;
