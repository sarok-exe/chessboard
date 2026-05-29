import React from "react";

import ContextMenuProps from "./ContextMenuProps";
import * as styles from "./ContextMenu.module.css";

function ContextMenu({
    position,
    menuStyle,
    optionStyle,
    options
}: ContextMenuProps) {
    return <div
        className={styles.wrapper}
        style={{
            ...menuStyle,
            left: `${position.x}px`,
            top: `${position.y}px`
        }}
    >
        {
            options.map(option => (
                <span
                    className={styles.option}
                    style={optionStyle}
                    onClick={() => option.onSelect?.()}
                >
                    {option.icon && (typeof option.icon === "string"
                        ? <img src={option.icon} height={20} />
                        : option.icon
                    )}

                    {option.label}
                </span>
            ))
        }
    </div>;
}

export default ContextMenu;
