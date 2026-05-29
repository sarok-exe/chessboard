import React from "react";

import SidebarProps from "./SidebarProps";
import * as styles from "./Sidebar.module.css";

import iconInterfaceClose from "@assets/img/interface/close.svg";

function Sidebar({ style, onClose }: SidebarProps) {
    return <div
        className={styles.sidebar}
        style={style}
        onClick={event => event.stopPropagation()}
    >
        <div className={styles.titleSection}>
            <img
                className={styles.closeButton}
                src={iconInterfaceClose}
                onClick={onClose}
            />
        </div>
    </div>;
}

export default Sidebar;