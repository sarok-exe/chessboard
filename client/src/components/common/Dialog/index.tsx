import React, { useEffect } from "react";

import BlurBackground from "@/components/layout/BlurBackground";
import Button from "../Button";

import DialogProps from "./DialogProps";
import * as styles from "./Dialog.module.css";

function Dialog({
    children,
    onClose,
    className,
    style,
    closeButtonStyle
}: DialogProps) {
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    return <BlurBackground className={styles.wrapper}>
        <div className={`${styles.menu} ${className}`} style={style}>
            <Button
                className={styles.closeButton}
                icon={<svg width="30" height="30" viewBox="0 -960 960 960" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>}
                iconSize="30px"
                style={closeButtonStyle}
                onClick={onClose}
            />

            {children}
        </div>
    </BlurBackground>;
}

export default Dialog;
