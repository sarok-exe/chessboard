import React from "react";

import PlayerProfileProps from "./PlayerProfileProps";
import * as styles from "./PlayerProfile.module.css";

function PlayerProfile({ profile }: PlayerProfileProps) {
    return <div className={styles.wrapper}>
        {profile.image
            ? <img
                className={styles.profileImage}
                src={profile.image}
                onError={e => {
                    (e.target as HTMLImageElement).style.display = "none";
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                        const placeholder = document.createElement("div");
                        placeholder.className = styles.placeholderIcon;
                        placeholder.innerHTML = `<svg width="22" height="22" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/></svg>`;
                        parent.insertBefore(placeholder, (e.target as HTMLImageElement).nextSibling);
                    }
                }}
            />
            : <div className={styles.placeholderIcon}>
                <svg width="22" height="22" viewBox="0 -960 960 960" fill="currentColor">
                    <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z"/>
                </svg>
            </div>
        }

        {profile.title && <span className={styles.title}>
            {profile.title}
        </span>}

        <span className={styles.username}>
            {profile.username || "?"}
        </span>

        {profile.rating != undefined
            && <span className={styles.rating}>
                ({profile.rating})
            </span>
        }
    </div>;
}

export default PlayerProfile;
