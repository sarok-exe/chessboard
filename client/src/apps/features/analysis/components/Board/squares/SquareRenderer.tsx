import React, {
    Children,
    ReactNode,
    useContext,
    forwardRef,
    isValidElement,
    memo
} from "react";
import {
    CustomSquareProps,
    CustomSquareRenderer
} from "react-chessboard/dist/chessboard/types";

import { parseUciMove } from "shared/lib/utils/chess";
import {
    classificationColours,
    classificationImages
} from "@analysis/constants/classifications";
import { useBoardContext } from "../BoardContext";

import { SquaresContext } from "./SquaresContext";
import * as styles from "./Square.module.css";

function getSquareElements(children: ReactNode) {
    const squareElements = Children.toArray(children);

    const piece = squareElements.find(element => (
        isValidElement(element) && element.props.piece
    ));

    const notations = squareElements.filter(element => (
        isValidElement(element) && element.props.row != undefined
    ));

    return [ piece, ...notations ];
}

const SquareRendererComponent = memo(forwardRef<HTMLDivElement, CustomSquareProps>((
    { children, style, square }, ref
) => {
    const { node, enableClassifications } = useBoardContext();
    const squares = useContext(SquaresContext);

    const playedMove = node.state.move?.uci
        ? parseUciMove(node.state.move.uci)
        : undefined;

    const highlightColour = node.state.classification
        ? classificationColours[node.state.classification]
        : "#ffff33";

    const [ piece, ...notations ] = getSquareElements(children);

    return <div ref={ref} style={{ ...style, position: "relative" }}>
        {(!squares.pieceDropFlag || square != playedMove?.from) && piece}

        {notations}

        {(square == playedMove?.from || square == playedMove?.to)
            && <div className={styles.playedHighlight} style={{
                backgroundColor: highlightColour
            }}/>
        }

        {squares.playable.includes(square) && <div
            className={styles.playableMoveCircle}
        />}

        {squares.capturable.includes(square) && <div
            className={styles.capturableMoveCircle}
        />}

        {squares.highlighted.includes(square)
            && <div className={styles.highlight} />
        }

        {node.state.classification
            && square == playedMove?.to
            && enableClassifications
            && <img
                src={classificationImages[node.state.classification]}
                className={styles.classification}
            />
        }
    </div>;
}));

export const customSquareRenderer = SquareRendererComponent as CustomSquareRenderer;
