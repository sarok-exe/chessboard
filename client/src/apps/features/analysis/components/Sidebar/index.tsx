import React from "react";
import useNavigationStore from "@analysis/stores/NavigationStore";
import useAuthStore from "@/stores/AuthStore";
import * as styles from "./Sidebar.module.css";

function Sidebar() {
    const { activeView, setActiveView } = useNavigationStore();
    const user = useAuthStore(s => s.user);

    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                <button
                    className={`${styles.navItem} ${activeView === "game-view" ? styles.active : ""}`}
                    onClick={() => setActiveView("game-view")}
                >
                    <span className={styles.icon}>♟</span>
                    <span className={styles.label}>Home</span>
                </button>
                <button
                    className={`${styles.navItem} ${activeView === "puzzles" ? styles.active : ""}`}
                    onClick={() => setActiveView("puzzles")}
                >
                    <span className={styles.icon}>🧩</span>
                    <span className={styles.label}>Puzzles</span>
                </button>
                {user ? (
                    <button
                        className={`${styles.navItem} ${activeView === "profile" ? styles.active : ""}`}
                        onClick={() => setActiveView("profile")}
                    >
                        <span className={styles.icon}>♚</span>
                        <span className={styles.label}>Account</span>
                    </button>
                ) : (
                    <button
                        className={`${styles.navItem} ${activeView === "login" ? styles.active : ""}`}
                        onClick={() => setActiveView("login")}
                    >
                        <span className={styles.icon}>🔑</span>
                        <span className={styles.label}>Login</span>
                    </button>
                )}
                {user && (
                    <button
                        className={`${styles.navItem} ${styles.logoutItem}`}
                        onClick={() => useAuthStore.getState().logout()}
                    >
                        <span className={styles.icon}>🚪</span>
                        <span className={styles.label}>Logout</span>
                    </button>
                )}
            </nav>
            {user && (
                <div className={styles.userInfo}>
                    <span className={styles.userAvatar}>
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="" className={styles.avatarImg} />
                        ) : (
                            "♚"
                        )}
                    </span>
                    <span className={styles.userName}>
                        {user.displayName || user.email?.split("@")[0] || "User"}
                    </span>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;
