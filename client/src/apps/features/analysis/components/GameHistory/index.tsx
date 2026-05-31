import React, { useState, useEffect, useCallback, useMemo } from "react";
import useAnalysisGameStore from "@analysis/stores/AnalysisGameStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import parsePgn from "@/lib/games/pgn";
import parseStateTree from "shared/lib/stateTree/parse";
import * as styles from "./GameHistory.module.css";

interface ChessComGame {
    url: string;
    pgn: string;
    time_control: string;
    end_time: number;
    rated: boolean;
    accuracies?: Record<string, number>;
    tcn: string;
    uuid: string;
    initial_setup: string;
    fen: string;
    time_class: string;
    rules: string;
    white: { username: string; rating: number; result: string; "@id": string };
    black: { username: string; rating: number; result: string; "@id": string };
    eco?: string;
    eco_url?: string;
}

type Result = "win" | "loss" | "draw" | "abandoned" | "other";

function classifyResult(player: string, white: ChessComGame["white"], black: ChessComGame["black"]): Result {
    const side = white.username.toLowerCase() === player.toLowerCase() ? white : black;
    const r = side.result;
    if (r === "win") return "win";
    if (r === "checkmated" || r === "resigned" || r === "timeout" || r === "lose" || r === "bughousepartnerlose") return "loss";
    if (r === "agreed" || r === "repetition" || r === "stalemate" || r === "insufficient" || r === "50move" || r === "draw" || r === "timevsinsufficient") return "draw";
    if (r === "abandoned" || r === "kingofthehill" || r === "threecheck" || r === "bughousepartnerwin") return "abandoned";
    return "other";
}

function formatDate(ts: number): string {
    const d = new Date(ts * 1000);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatTimeControl(tc: string): string {
    if (!tc || tc === "-") return "-";
    const parts = tc.split("+");
    const base = parseInt(parts[0]);
    if (base >= 600) return `${base / 60} min`;
    if (base >= 60) return `${Math.floor(base / 60)} min`;
    return `${base} sec`;
}

function sourceLabel(url: string): { label: string; icon: string } {
    if (url.includes("chess.com")) return { label: "Chess.com", icon: "♚" };
    if (url.includes("lichess")) return { label: "Lichess", icon: "♛" };
    return { label: "PGN", icon: "📄" };
}

const LS_KEY = "chess-username";

function GameHistory() {
    const [username, setUsername] = useState(() => localStorage.getItem(LS_KEY) || "");
    const [inputVal, setInputVal] = useState(username);
    const [games, setGames] = useState<ChessComGame[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(50);
    const [importOpen, setImportOpen] = useState(false);
    const [pgnText, setPgnText] = useState("");
    const { setAnalysisGame, setGameAnalysisOpen } = useAnalysisGameStore();
    const { setCurrentStateTreeNode } = useAnalysisBoardStore();

    const loadPgn = useCallback((pgn: string) => {
        try {
            const game = parsePgn(pgn);
            const analysisGame = { ...game, stateTree: parseStateTree(game) };
            setAnalysisGame(analysisGame);
            setCurrentStateTreeNode(analysisGame.stateTree);
            setGameAnalysisOpen(true);
        } catch {
            setError("Invalid PGN");
        }
    }, [setAnalysisGame, setCurrentStateTreeNode, setGameAnalysisOpen]);

    const fetchGames = useCallback(async (name: string) => {
        if (!name.trim()) return;
        setLoading(true);
        setError("");
        try {
            const now = new Date();
            const months: string[] = [];
            for (let i = 0; i < 3; i++) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                months.push(`${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`);
            }
            const all: ChessComGame[] = [];
            for (const m of months) {
                try {
                    const res = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(name)}/games/${m}`);
                    if (!res.ok) continue;
                    const data = await res.json();
                    if (data.games) all.push(...data.games);
                } catch { /* skip month */ }
            }
            all.sort((a, b) => b.end_time - a.end_time);
            setGames(all);
            setPage(0);
        } catch (e: any) {
            setError(e?.message || "Failed to fetch games");
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (username) fetchGames(username);
    }, [username, fetchGames]);

    const handleUsernameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = inputVal.trim();
        if (!val) return;
        localStorage.setItem(LS_KEY, val);
        setUsername(val);
    };

    const handleImport = () => {
        if (!pgnText.trim()) return;
        loadPgn(pgnText);
        setImportOpen(false);
        setPgnText("");
    };

    const totalGames = games.length;
    const totalPages = Math.ceil(totalGames / perPage) || 1;
    const currentPage = Math.min(page, totalPages - 1);

    const pagedGames = useMemo(() => {
        const start = currentPage * perPage;
        return games.slice(start, start + perPage);
    }, [games, currentPage, perPage]);

    const pageNumbers = useMemo(() => {
        const nums: (number | "...")[] = [];
        const maxVisible = 7;
        if (totalPages <= maxVisible) {
            for (let i = 0; i < totalPages; i++) nums.push(i);
        } else {
            nums.push(0);
            const left = Math.max(1, currentPage - 2);
            const right = Math.min(totalPages - 2, currentPage + 2);
            if (left > 1) nums.push("...");
            for (let i = left; i <= right; i++) nums.push(i);
            if (right < totalPages - 2) nums.push("...");
            nums.push(totalPages - 1);
        }
        return nums;
    }, [totalPages, currentPage]);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>My Chess Games</h1>
                    <p>Chess history of {username || "—"}</p>
                </div>
                <form className={styles.actions} onSubmit={handleUsernameSubmit}>
                    <input
                        className={styles.usernameInput}
                        placeholder="Chess.com username"
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value)}
                    />
                    <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                        ↩ Load
                    </button>
                    <button
                        type="button"
                        className={styles.btn}
                        onClick={() => { setImportOpen(true); }}
                    >
                        + Import
                    </button>
                </form>
            </div>

            {error && <div className={styles.errorState}>{error}</div>}

            {loading ? (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner} />
                    <span>Loading games…</span>
                </div>
            ) : games.length === 0 && username ? (
                <div className={styles.emptyState}>
                    <h3>No games found</h3>
                    <p>Try a different username or import a PGN file.</p>
                </div>
            ) : games.length === 0 ? (
                <div className={styles.emptyState}>
                    <h3>Enter a Chess.com username</h3>
                    <p>Your recent games will appear here.</p>
                </div>
            ) : (
                <>
                    <div className={styles.toolbar}>
                        <span className={styles.gameCount}>
                            Showing <strong>1–{Math.min(perPage, totalGames)}</strong> of <strong>{totalGames}</strong> games
                        </span>
                        <button className={styles.btn} onClick={() => fetchGames(username)}>
                            ↻ Refresh
                        </button>
                    </div>

                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Players</th>
                                    <th>Time</th>
                                    <th>Result</th>
                                    <th>Source</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedGames.map(g => {
                                    const playerName = username;
                                    const result = classifyResult(playerName, g.white, g.black);
                                    const src = sourceLabel(g.url);
                                    const isPlayerWhite = g.white.username.toLowerCase() === playerName.toLowerCase();
                                    const playerSide = isPlayerWhite ? g.white : g.black;
                                    const opponent = isPlayerWhite ? g.black : g.white;
                                    return (
                                        <tr key={g.uuid}>
                                            <td className={styles.dateCell}>{formatDate(g.end_time)}</td>
                                            <td>
                                                <div className={styles.playersCell}>
                                                    <div className={styles.playerRow}>
                                                        <span className={styles.playerName}>{playerSide.username}</span>
                                                        <span className={styles.playerElo}>({playerSide.rating})</span>
                                                    </div>
                                                    <div className={styles.playerRow}>
                                                        <span className={styles.playerName}>{opponent.username}</span>
                                                        <span className={styles.playerElo}>({opponent.rating})</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{formatTimeControl(g.time_control)}</td>
                                            <td>
                                                <span className={`${styles.resultBadge} ${
                                                    result === "win" ? styles.resultWin :
                                                    result === "loss" ? styles.resultLoss :
                                                    result === "draw" ? styles.resultDraw :
                                                    styles.resultOther
                                                }`}>
                                                    {result === "win" ? "Win" :
                                                     result === "loss" ? "Loss" :
                                                     result === "draw" ? "Draw" :
                                                     result === "abandoned" ? "Abandoned" : result}
                                                </td>
                                            <td>
                                                <span className={styles.sourceCell}>
                                                    <span className={styles.sourceIcon}>{src.icon}</span>
                                                    {src.label}
                                                </span>
                                            </td>
                                            <td>
                                                {g.url && g.url.includes("chess.com") ? (
                                                    <a href={g.url} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
                                                        View ↗
                                                    </a>
                                                ) : (
                                                    <button
                                                        className={styles.viewLink}
                                                        onClick={() => loadPgn(g.pgn)}
                                                        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                                                    >
                                                        Load
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {totalGames > perPage && (
                            <div className={styles.pagination}>
                                <div className={styles.perPage}>
                                    Per page:
                                    <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(0); }}>
                                        <option value={10}>10</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                                <div className={styles.pageBtns}>
                                    <button
                                        className={styles.pageNum}
                                        disabled={currentPage === 0}
                                        onClick={() => setPage(0)}
                                    >
                                        «
                                    </button>
                                    <button
                                        className={styles.pageNum}
                                        disabled={currentPage === 0}
                                        onClick={() => setPage(p => Math.max(0, p - 1))}
                                    >
                                        ‹
                                    </button>
                                    {pageNumbers.map((n, i) =>
                                        n === "..." ? (
                                            <span key={`ellipsis-${i}`} className={styles.pageNum} style={{ border: "none", cursor: "default" }}>…</span>
                                        ) : (
                                            <button
                                                key={n}
                                                className={`${styles.pageNum} ${n === currentPage ? styles.pageNumActive : ""}`}
                                                onClick={() => setPage(n)}
                                            >
                                                {n + 1}
                                            </button>
                                        )
                                    )}
                                    <button
                                        className={styles.pageNum}
                                        disabled={currentPage >= totalPages - 1}
                                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    >
                                        ›
                                    </button>
                                    <button
                                        className={styles.pageNum}
                                        disabled={currentPage >= totalPages - 1}
                                        onClick={() => setPage(totalPages - 1)}
                                    >
                                        »
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {importOpen && (
                <div className={styles.modalOverlay} onClick={() => setImportOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h2>Import PGN</h2>
                        <p>Paste your PGN text below to load the game into the analysis board.</p>
                        <textarea
                            className={styles.modalTextarea}
                            placeholder="Paste PGN here..."
                            value={pgnText}
                            onChange={e => setPgnText(e.target.value)}
                        />
                        <div className={styles.modalActions}>
                            <button className={styles.btn} onClick={() => setImportOpen(false)}>Cancel</button>
                            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleImport}>Import</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GameHistory;
