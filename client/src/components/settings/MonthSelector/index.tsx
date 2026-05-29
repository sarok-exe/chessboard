import React, { useState } from "react";

import { monthNames } from "shared/lib/utils/date";
import Button from "../../common/Button";

import MonthSelectorProps from "./MonthSelectorProps";
import * as styles from "./MonthSelector.module.css";

function MonthSelector({ 
    onMonthChange, 
    allowFuture, 
    locked
}: MonthSelectorProps) {
    const [ year, setYear ] = useState(new Date().getFullYear());
    const [ month, setMonth ] = useState(new Date().getMonth());

    function incrementMonth(offset: number) {
        if (locked) return;

        let newMonth = month + offset;
        let newYear = year;

        const currentDate = new Date();
        if (
            newMonth > currentDate.getMonth() 
            && newYear >= currentDate.getFullYear()
            && !allowFuture
        ) return;

        if (newMonth >= 12) {
            newYear += Math.floor(newMonth / 12);
            newMonth %= 12;
        } else if (newMonth < 0) {
            newYear += Math.floor(newMonth / 12);
            newMonth = 12 + newMonth;
        }

        setMonth(newMonth);
        setYear(newYear);

        onMonthChange?.(newMonth + 1, newYear);
    }

    return <div className={styles.wrapper}>
        <Button
            className={styles.selectorButton}
            icon={<svg width="24" height="24" viewBox="0 -960 960 960" fill="currentColor"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>}
            iconSize="30px"
            onClick={() => incrementMonth(-1)}
        />

        <span>{monthNames[month]} {year}</span>

        <Button
            className={styles.selectorButton}
            icon={<svg width="24" height="24" viewBox="0 -960 960 960" fill="currentColor"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg>}
            iconSize="30px"
            onClick={() => incrementMonth(1)}
        />
    </div>;
}

export default MonthSelector;
