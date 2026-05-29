import React, { useState } from "react";

import displayToast from "@/lib/toast";

import TextFieldProps from "./TextFieldProps";
import * as styles from "./TextField.module.css";

function TextField({
    wrapperClassName,
    wrapperStyle,
    className,
    style,
    copyClassName,
    copyStyle,
    placeholder,
    value,
    multiline,
    readOnly,
    disabled,
    copyable,
    copyTooltip,
    copyToast,
    password,
    onChange,
    onClick
}: TextFieldProps) {
    const [ text, setText ] = useState(value || "");

    const sharedProps = {
        className: `${styles.field} ${className}`,
        placeholder,
        style,
        value,
        readOnly,
        disabled
    };

    function copy() {
        navigator.clipboard.writeText(text);

        if (!copyToast) return;

        displayToast({
            message: copyToast,
            theme: "success",
            autoClose: 2
        });
    }

    return <div
        className={`${styles.wrapper} ${wrapperClassName}`}
        style={wrapperStyle}
    >
        {multiline
            ? <textarea
                {...sharedProps}
                onChange={event => {
                    setText(event.target.value);
                    onChange?.(event.target.value);
                }}
                onClick={onClick}
            ></textarea>
            : <input
                {...sharedProps}
                type={password ? "password" : "text"}
                onChange={event => {
                    setText(event.target.value);
                    onChange?.(event.target.value);
                }}
                onClick={onClick}
            />
        }

        {copyable && <div
            className={`${styles.copyWrapper} ${copyClassName}`}
            style={{
                height: `min(${multiline ? "35px" : "100%"}, 100%)`,
                ...copyStyle
            }}
            title={copyTooltip}
            onClick={copy}
        >
            <svg width="24" height="24" viewBox="0 -960 960 960" fill="currentColor"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/></svg>
        </div>}
    </div>;
}

export default TextField;