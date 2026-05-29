import React from "react";
import { useTranslation } from "react-i18next";

import AnalyseButtonProps from "./AnalyseButtonProps";
import * as styles from "./AnalyseButton.module.css";

function AnalyseButton({ style, onClick }: AnalyseButtonProps) {
    const { t } = useTranslation("analysis");

    return <button
        className={styles.analyseButton}
        style={style}
        onClick={onClick}
    >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        {t("analyseButton")}
    </button>;
}

export default AnalyseButton;
