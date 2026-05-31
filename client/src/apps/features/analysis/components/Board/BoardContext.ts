import { createContext, useContext } from "react";

import { defaultRootNode } from "shared/constants/utils";

export interface BoardContextValue {
    node: typeof defaultRootNode;
    enableClassifications: boolean;
}

export const BoardContext = createContext<BoardContextValue>({
    node: defaultRootNode,
    enableClassifications: true
});

export function useBoardContext() {
    return useContext(BoardContext);
}
