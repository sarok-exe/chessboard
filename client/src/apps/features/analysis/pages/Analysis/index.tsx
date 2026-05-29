import React from "react";

import useGameLoader from "@analysis/hooks/useGameLoader";
import AnalysisPanel from "@analysis/components/AnalysisPanel";

import BoardArea from "./BoardArea";
import * as styles from "./Analysis.module.css";

function Analysis() {
    useGameLoader();

    return <div className={styles.wrapper}>
        <div className={styles.analysisSection}>
            <BoardArea/>

            <AnalysisPanel className={styles.panel} />
        </div>
    </div>;
}

export default Analysis;