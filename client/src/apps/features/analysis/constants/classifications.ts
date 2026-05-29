import { Classification } from "shared/constants/Classification";

import iconClassificationsBrilliant from "@assets/img/classifications/brilliant_64x.png";
import iconClassificationsCritical from "@assets/img/classifications/critical_64x.png";
import iconClassificationsBest from "@assets/img/classifications/best_64x.png";
import iconClassificationsExcellent from "@assets/img/classifications/excellent_64x.png";
import iconClassificationsOkay from "@assets/img/classifications/good_64x.png";
import iconClassificationsInaccuracy from "@assets/img/classifications/inaccuracy_64x.png";
import iconClassificationsMistake from "@assets/img/classifications/mistake_64x.png";
import iconClassificationsBlunder from "@assets/img/classifications/blunder_64x.png";
import iconClassificationsForced from "@assets/img/classifications/forced_64x.png";
import iconClassificationsTheory from "@assets/img/classifications/book_64x.png";
import iconClassificationsRisky from "@assets/img/classifications/sharp_64x.png";

import iconClassificationsLoading from "@assets/img/classifications/correct_64x.png";
import iconClassificationsError from "@assets/img/classifications/incorrect_64x.png";

export const classificationImages = {
    [Classification.BRILLIANT]: iconClassificationsBrilliant,
    [Classification.CRITICAL]: iconClassificationsCritical,
    [Classification.BEST]: iconClassificationsBest,
    [Classification.EXCELLENT]: iconClassificationsExcellent,
    [Classification.OKAY]: iconClassificationsOkay,
    [Classification.INACCURACY]: iconClassificationsInaccuracy,
    [Classification.MISTAKE]: iconClassificationsMistake,
    [Classification.BLUNDER]: iconClassificationsBlunder,
    [Classification.FORCED]: iconClassificationsForced,
    [Classification.THEORY]: iconClassificationsTheory,
    [Classification.RISKY]: iconClassificationsRisky
};

export const loadingClassificationIcon = iconClassificationsLoading;

export const errorClassificationIcon = iconClassificationsError;

export const classificationColours = {
    [Classification.BRILLIANT]: "#1baaa6",
    [Classification.CRITICAL]: "#5b8baf",
    [Classification.BEST]: "#98bc49",
    [Classification.EXCELLENT]: "#98bc49",
    [Classification.OKAY]: "#97af8b",
    [Classification.INACCURACY]: "#f4bf44",
    [Classification.MISTAKE]: "#e28c28",
    [Classification.BLUNDER]: "#c93230",
    [Classification.FORCED]: "#97af8b",
    [Classification.THEORY]: "#a88764",
    [Classification.RISKY]: "#8983ac"
};

export const classificationNames = {
    [Classification.BRILLIANT]: "classifications.brilliant",
    [Classification.CRITICAL]: "classifications.critical",
    [Classification.BEST]: "classifications.best",
    [Classification.EXCELLENT]: "classifications.excellent",
    [Classification.OKAY]: "classifications.okay",
    [Classification.INACCURACY]: "classifications.inaccuracy",
    [Classification.MISTAKE]: "classifications.mistake",
    [Classification.BLUNDER]: "classifications.blunder",
    [Classification.FORCED]: "classifications.forced",
    [Classification.THEORY]: "classifications.theory",
    [Classification.RISKY]: "classifications.risky"
};

export const inalterableClassifications = [
    Classification.BRILLIANT,
    Classification.CRITICAL,
    Classification.BEST,
    Classification.FORCED,
    Classification.THEORY
];