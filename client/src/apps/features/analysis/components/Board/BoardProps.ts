import { CSSProperties } from "react";
import { Move } from "chess.js";

import { StateTreeNode } from "shared/types/game/position/StateTreeNode";
import PlayerProfile from "shared/types/game/PlayerProfile";
import Evaluation from "shared/types/game/position/Evaluation";

type Arrow = [string, string, string];

interface BoardProps {
    className?: string;
    style?: CSSProperties;
    profileClassName?: string;
    profileStyle?: CSSProperties;
    whiteProfile?: PlayerProfile;
    blackProfile?: PlayerProfile;
    node?: StateTreeNode;
    flipped?: boolean;
    evaluation?: Evaluation;
    arrows?: Arrow[];
    theme?: {
        lightSquareColour?: string;
        darkSquareColour?: string;
    };
    piecesDraggable?: boolean;
    enableClassifications?: boolean;

    onAddMove?: (move: Move) => boolean;
}

export default BoardProps;
