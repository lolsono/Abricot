"use client";

import Image from "next/image";
import styles from "./ViewToggle.module.css";

export default function ViewToggle({ view, onChange }) {

    return (
        <div className={styles.toggle}>

            <button
                type="button"
                className={`${styles.toggleButton} ${
                    view === "list" ? styles.toggleButtonActive : ""
                }`}
                onClick={() => onChange("list")}
            >
                <Image
                    src="/tcheck_orange.svg"
                    alt="logo de tcheck"
                    className={styles.metaIconImg}
                    width={11}
                    height={11}
                />
                Liste
            </button>

            <button
                type="button"
                className={`${styles.toggleButton} ${
                    view === "kanban" ? styles.toggleButtonActive : ""
                }`}
                onClick={() => onChange("kanban")}
            >
                <Image
                    src="/calendar_orange.svg"
                    alt="Calendrier orange"
                    className={styles.metaIconImg}
                    width={11}
                    height={11}
                />
                Kanban
            </button>

        </div>
    );
}
