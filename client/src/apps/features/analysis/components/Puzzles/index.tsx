import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Chess, Move } from "chess.js";
import Board from "@analysis/components/Board";
import { LineNode, Puzzle } from "./types";
import { COURSES, loadCourse } from "./puzzleData";
import { playPuzzleSound } from "./puzzleSounds";
import * as styles from "./PuzzlesView.module.css";

function boardTurn(fen: string): "w" | "b" {
    return (fen.split(" ")[1] || "w") as "w" | "b";
}

function opponentColor(turn: "w" | "b"): "w" | "b" {
    return turn === "w" ? "b" : "w";
}

function PuzzlesView() {
    const [mode, setMode] = useState<"select" | "play">("select");
    const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fen, setFen] = useState("start");
    const [currentNode, setCurrentNode] = useState<LineNode | null>(null);
    const [rootNode, setRootNode] = useState<LineNode | null>(null);
    const [rootFen, setRootFen] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const [wrongMove, setWrongMove] = useState(false);
    const [comments, setComments] = useState<string[]>([]);
    const [revealNext, setRevealNext] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [courseKey, setCourseKey] = useState("");

    const fenRef = useRef(fen);
    fenRef.current = fen;
    const nodeRef = useRef(currentNode);
    nodeRef.current = currentNode;
    const waitingRef = useRef(waiting);
    waitingRef.current = waiting;
    const completeRef = useRef(isComplete);
    completeRef.current = isComplete;

    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    const clearTimers = useCallback(() => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
    }, []);

    useEffect(() => {
        return () => clearTimers();
    }, [clearTimers]);

    const schedule = useCallback((fn: () => void, ms: number) => {
        const id = setTimeout(fn, ms);
        timersRef.current.push(id);
    }, []);

    const userColor = useMemo(() => {
        if (!rootFen || !rootNode) return "w";
        const firstMove = rootNode.nextNodes[0];
        if (!firstMove) return "w";
        try {
            const game = new Chess(rootFen);
            game.move(firstMove.move);
            return opponentColor(boardTurn(game.fen()));
        } catch {
            return "w";
        }
    }, [rootFen, rootNode]);

    const setupPuzzle = useCallback((pzl: Puzzle) => {
        clearTimers();
        setFen(pzl.FEN);
        setRootFen(pzl.FEN);
        setRootNode(pzl.pgn);
        setCurrentNode(pzl.pgn);
        setIsComplete(false);
        setWrongMove(false);
        setComments([]);
        setRevealNext(pzl.configOptions?.revealNextMove ?? false);
        setWaiting(true);

        schedule(() => {
            try {
                const game = new Chess(pzl.FEN);
                const firstNode = pzl.pgn.nextNodes[0];
                if (firstNode) {
                    const result = game.move(firstNode.move);
                    setFen(game.fen());
                    setCurrentNode(firstNode);
                    setComments(firstNode.comment || []);
                    playPuzzleSound(result);
                }
            } catch (e) {
                // skip invalid moves
            }
            setWaiting(false);
        }, 800);
    }, [clearTimers, schedule]);

    const selectCourse = useCallback((key: string) => {
        clearTimers();
        const loaded = loadCourse(key);
        if (loaded.length === 0) return;
        setPuzzles(loaded);
        setCourseKey(key);
        setCurrentIndex(0);
        setMode("play");
        setupPuzzle(loaded[0]);
    }, [clearTimers, setupPuzzle]);

    const selectPuzzle = useCallback((index: number) => {
        clearTimers();
        setCurrentIndex(index);
        setupPuzzle(puzzles[index]);
    }, [clearTimers, puzzles, setupPuzzle]);

    const nextPuzzle = useCallback(() => {
        const next = currentIndex + 1;
        selectPuzzle(next < puzzles.length ? next : 0);
    }, [currentIndex, puzzles.length, selectPuzzle]);

    const retry = useCallback(() => {
        selectPuzzle(currentIndex);
    }, [currentIndex, selectPuzzle]);

    const handleMove = useCallback((move: Move): boolean => {
        if (waitingRef.current || completeRef.current) return false;

        const cur = nodeRef.current;
        if (!cur) return false;

        const san = move.san;
        const matched = cur.nextNodes.find(n => n.move === san);

        if (matched) {
            setCurrentNode(matched);
            setComments(matched.comment || []);

            try {
                const game = new Chess(fenRef.current);
                const result = game.move(san);
                setFen(game.fen());
                playPuzzleSound(result);
            } catch (e) {
                return false;
            }

            if (matched.nextNodes.length === 0) {
                setIsComplete(true);
                return true;
            }

            setWaiting(true);
            schedule(() => {
                try {
                    const oppChoices = matched.nextNodes;
                    const oppMove = oppChoices.length === 1
                        ? oppChoices[0]
                        : oppChoices[Math.floor(Math.random() * oppChoices.length)];

                    const game = new Chess(fenRef.current);
                    const result = game.move(oppMove.move);
                    setFen(game.fen());
                    setCurrentNode(oppMove);
                    setComments(oppMove.comment || []);
                    playPuzzleSound(result);

                    if (oppMove.nextNodes.length === 0) {
                        setIsComplete(true);
                    }
                } catch (e) {
                    // skip
                }
                setWaiting(false);
            }, 800);

            return true;
        }

        setWrongMove(true);
        setTimeout(() => setWrongMove(false), 600);
        return false;
    }, [schedule]);

    const displayHint = useCallback(() => {
        const cur = nodeRef.current;
        if (!cur || cur.nextNodes.length === 0) return;

        const nextMove = cur.nextNodes[0].move;
        try {
            const game = new Chess(fenRef.current);
            const moves = game.moves({ verbose: true });
            const match = moves.find(m => m.san === nextMove);
            if (match) {
                const sq = match.from;
                const el = document.querySelector(`[data-square="${sq}"]`);
                if (el) {
                    el.classList.add(styles.hintFlash);
                    setTimeout(() => el.classList.remove(styles.hintFlash), 1500);
                }
            }
        } catch (e) {
            // ignore
        }
    }, []);

    const boardNode = useMemo(() => ({
        state: {
            fen,
            moveColour: boardTurn(fen)
        }
    }), [fen]);

    const currentPuzzle = puzzles[currentIndex];
    const userColorLabel = userColor === "w" ? "White" : "Black";

    if (mode === "select") {
        return (
            <div className={styles.wrapper}>
                <div className={styles.courseGrid}>
                    {COURSES.map(c => (
                        <button
                            key={c.key}
                            className={styles.courseCard}
                            onClick={() => selectCourse(c.key)}
                        >
                            <h3 className={styles.courseName}>{c.name}</h3>
                            <p className={styles.courseDesc}>{c.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.playLayout}>
                <div className={styles.boardSection}>
                    <div className={`${styles.boardWrapper} ${wrongMove ? styles.wrongFlash : ""}`}>
                        <Board
                            style={{ maxWidth: "calc(100vh - 140px)" }}
                            node={boardNode as any}
                            onAddMove={handleMove}
                            piecesDraggable={!waiting && !isComplete}
                            enableClassifications={false}
                        />
                    </div>
                </div>
                <div className={styles.controlSection}>
                    <div className={styles.puzzleHeader}>
                        <h2 className={styles.puzzleTitle}>{currentPuzzle?.title}</h2>
                        <span className={styles.progress}>
                            {currentIndex + 1} / {puzzles.length}
                        </span>
                    </div>

                    <div className={styles.courseSelect}>
                        <select
                            className={styles.courseDropdown}
                            value={courseKey}
                            onChange={e => selectCourse(e.target.value)}
                        >
                            {COURSES.map(c => (
                                <option key={c.key} value={c.key}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.puzzleNav}>
                        <select
                            className={styles.puzzleDropdown}
                            value={currentIndex}
                            onChange={e => selectPuzzle(Number(e.target.value))}
                        >
                            {puzzles.map((p, i) => (
                                <option key={i} value={i}>{i + 1}. {p.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.userColorBox}>
                        You play <strong>{userColorLabel}</strong>
                    </div>

                    {comments.length > 0 && (
                        <div className={styles.commentBox}>
                            {comments.map((c, i) => (
                                <p key={i} className={styles.commentLine}>{c}</p>
                            ))}
                        </div>
                    )}

                    {revealNext && currentNode && currentNode.nextNodes.length > 0 && (
                        <div className={styles.revealBox}>
                            Next move: <strong>{currentNode.nextNodes[0].move}</strong>
                        </div>
                    )}

                    <div className={styles.buttonGroup}>
                        {!isComplete && currentNode && currentNode.nextNodes.length > 0 && (
                            <button className={styles.hintBtn} onClick={displayHint}>
                                Hint
                            </button>
                        )}
                        <button className={styles.retryBtn} onClick={retry}>
                            Retry
                        </button>
                        {isComplete && (
                            <button className={styles.nextBtn} onClick={nextPuzzle}>
                                {currentIndex < puzzles.length - 1 ? "Next Puzzle →" : "Back to Start"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PuzzlesView;
