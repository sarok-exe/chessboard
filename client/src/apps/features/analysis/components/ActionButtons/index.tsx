import React from "react";

import * as styles from "./ActionButtons.module.css";

function ActionButtons() {
    return (
        <div className={styles.buttons}>
            <button className={`${styles.actionBtn} ${styles.highlightBtn}`}>
                <span>◈</span> Highlights
            </button>
            <button className={`${styles.actionBtn} ${styles.newGameBtn}`}>
                <span>+</span> New Game
            </button>
        </div>
    );
}

export default ActionButtons;
