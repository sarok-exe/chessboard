import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import FooterProps from "./FooterProps";
import * as styles from "./Footer.module.css";

function Footer({ className, style }: FooterProps) {
    const { t } = useTranslation("common");
    const copyrightYear = useMemo(() => (
        new Date().getFullYear()
    ), []);

    return <footer
        className={`${styles.wrapper} ${className}`}
        style={style}
    >
        <div className={styles.section}>
            <span className={styles.copyrightNotice}>
                Copyright © {copyrightYear}
            </span>
        </div>

        <div className={styles.links}>
            <div className={styles.section}>
                <a href="/analysis">
                    {t("sidebar.analysis")}
                </a>


            </div>
        </div>
    </footer>;
}

export default Footer;