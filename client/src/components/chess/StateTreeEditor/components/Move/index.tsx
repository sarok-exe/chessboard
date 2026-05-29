import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { findNodeRecursively, getNodeChain } from "shared/types/game/position/StateTreeNode";
import { classificationImages } from "@analysis/constants/classifications";
import ContextMenu from "@/components/common/ContextMenu";
import useSettingsStore from "@/stores/SettingsStore";
import useAnalysisBoardStore from "@analysis/stores/AnalysisBoardStore";
import useContextMenu from "@/hooks/useContextMenu";

import MoveClickEventContext from "../../MoveClickEventContext";
import MoveProps from "./MoveProps";
import * as styles from "./Move.module.css";

function Move({ node, children }: MoveProps) {
    const { t } = useTranslation("analysis");

    const onMoveClick = useContext(MoveClickEventContext);

    const classificationsHidden = useSettingsStore(
        state => state.settings.analysis.classifications.hide
    );

    const {
        currentStateTreeNode,
        setCurrentStateTreeNode,
        dispatchCurrentNodeUpdate
    } = useAnalysisBoardStore();

    const {
        contextMenuPosition,
        openContextMenu
    } = useContextMenu();

    function deleteNode() {
        if (!node?.parent) return;

        // Remove this node
        const siblings = node.parent.children;

        siblings.splice(
            siblings.indexOf(node),
            1
        );

        // If deleted node was mainline, promote first sibling
        if (node.mainline && siblings.length > 0) {
            for (const siblingChainNode of getNodeChain(siblings[0])) {
                siblingChainNode.mainline = true;
            }
        }

        // If the current node is a child of or is the deleted node
        const deletedNodeCurrentChild = findNodeRecursively(
            node,
            searchNode => searchNode.id == currentStateTreeNode.id
        );

        // Then, set the current node to the parent of the deleted one
        if (deletedNodeCurrentChild) {
            setCurrentStateTreeNode(node.parent);
        }

        dispatchCurrentNodeUpdate();
    }

    function promoteNode() {
        if (!node?.parent) return;

        const siblings = node.parent.children;

        const promotedNode = siblings
            .splice(siblings.indexOf(node), 1)
            .at(0);

        if (!promotedNode) return;

        siblings.unshift(promotedNode);

        setCurrentStateTreeNode(node);
    }

    return <>
        {node?.state.classification
            && !classificationsHidden
            && <img
                src={classificationImages[node.state.classification]}
                width={20}
                height={20}
            />
        }

        <span
            className={
                styles.wrapper
                + ` ${currentStateTreeNode == node && styles.current}`
            }
            onClick={() => {
                if (node) onMoveClick?.(node);
            }}
            onContextMenu={openContextMenu}
        >
            {node?.state.move?.san || children || "?"}
        </span>

        {contextMenuPosition && <ContextMenu
            position={contextMenuPosition}
            options={[
                {
                    icon: <svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>,
                    label: t("stateTreeEditor.moveContextMenu.delete"),
                    onSelect: deleteNode
                },
                {
                    icon: <svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg>,
                    label: t("stateTreeEditor.moveContextMenu.promote"),
                    onSelect: promoteNode
                },
                ...(process.env.NODE_ENV == "development"
                    ? [{
                        icon: <svg width="20" height="20" viewBox="0 -960 960 960" fill="currentColor"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>,
                        label: "Log state tree node",
                        onSelect: () => console.log(node)
                    }]
                    : []
                )
            ]}
        />}
    </>;
}

export default Move;
