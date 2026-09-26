"use client";

import Image from "next/image";
import styles from "./TaskSummaryCard.module.css";

const statusLabels = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    DONE: "Terminée",
};

const statusClass = {
    TODO: styles.statusTODO,
    IN_PROGRESS: styles.statusIN_PROGRESS,
    DONE: styles.statusDONE,
};

export default function TaskSummaryCard({ task, variant = "kanban", onView }) {

    const cardClass =
        variant === "list"
            ? `${styles.card} ${styles.cardList}`
            : `${styles.card} ${styles.cardKanban}`;

    return (
        <div className={cardClass}>

            <div className={styles.content}>

                <div className={styles.titleRow}>
                    <h3 className={styles.title}>
                        {task.title}
                    </h3>

                    {variant === "kanban" && (
                        <span
                            className={`${styles.statusBadge} ${
                                statusClass[task.status] || ""
                            }`}
                        >
                            {statusLabels[task.status] || task.status}
                        </span>
                    )}
                </div>

                <p className={styles.description}>
                    {task.description || "Aucune description"}
                </p>

                <div className={styles.meta}>

                    <span className={styles.metaItem}>
                        <Image
                            src="/folder_grey.svg"
                            alt="dossier gris"
                            className={styles.metaIconImg}
                            width={11}
                            height={11}
                        />
                        {task.project?.name || "Sans projet"}
                    </span>

                    <span className={styles.metaItem}>
                        <Image
                            src="/calendar.svg"
                            alt="échéance"
                            className={styles.metaIconImg}
                            width={11}
                            height={11}
                        />
                        {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "short",
                              })
                            : "Aucune"}
                    </span>

                    <span className={styles.metaItem}>
                        <Image
                            src="/tchat.svg"
                            alt="logo message"
                            className={styles.metaIconImg}
                            width={11}
                            height={11}
                        />
                        {task.commentsCount ?? task.comments?.length ?? 0}
                    </span>

                </div>

            </div>

            <div className={styles.side}>

                {variant === "list" && (
                    <span
                        className={`${styles.statusBadge} ${
                            statusClass[task.status] || ""
                        }`}
                    >
                        {statusLabels[task.status] || task.status}
                    </span>
                )}

                <button
                    type="button"
                    className={styles.viewButton}
                    onClick={() => onView?.(task)}
                >
                    Voir
                </button>

            </div>

        </div>
    );
}
