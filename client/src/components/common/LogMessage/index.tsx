import React from "react";

import LogMessageTheme from "./Theme";
import LogMessageProps from "./LogMessageProps";
import * as styles from "./LogMessage.module.css";

const themeColours: Record<LogMessageTheme, string> = {
    info: "#2c94ff66",
    success: "#54ff7366",
    warn: "#ffeb5466",
    error: "#ef414666"
};

function LogMessage({
    children,
    className,
    style,
    theme,
    includeIcon = true
}: LogMessageProps) {
    return <span
        className={`${styles.wrapper} ${className}`}
        style={{
            backgroundColor: theme
                ? themeColours[theme]
                : themeColours["error"],
            ...style
        }}
    >
        {includeIcon
            && <svg width="25" height="25" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
            </svg>
        }

        <span className={styles.message}>
            {children}
        </span>
    </span>;
}

export default LogMessage;
