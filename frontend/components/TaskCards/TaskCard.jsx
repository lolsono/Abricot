"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./TaskCard.module.css";
import Modal from "@/components/modal/Modal.js";
import { getInitials } from "@/utils/utils";
import { removeTask } from "@/services/taskServices";
import TasksFormModif from "../tasksFormModif/TasksFormModif";
import CommentsSection from "../CommentsSection/CommentsSection";

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

export default function TaskCard({ task, projectId, onEdit, onDelete }) {

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const [modalOpenModif, setModalOpenModif] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleModifTask = (data) => {
        onEdit?.(data);
        setModalOpenModif(false);
    };

    const handleDeleteTask = async () => {

        const confirmed = window.confirm(
            "Es-tu sûr de vouloir supprimer cette tâche ?"
        );

        if (!confirmed) return;

        setDeleteError("");

        try {
            await removeTask(task.id, projectId);
            onDelete?.(task.id);
        } catch (error) {
            console.error(error.message);
            setDeleteError(error.message || "Impossible de supprimer la tâche.");
        }
    };

    return (
        <article className={styles.taskCard}>

            <Modal
                isOpen={modalOpenModif}
                onClose={() => setModalOpenModif(false)}
                title="Modifier"
            >
                <TasksFormModif
                    task={task}
                    projectId={projectId}
                    onSubmit={handleModifTask}
                />
            </Modal>

            <div className={styles.taskHeader}>

                <div className={styles.taskTitleContainer}>

                    <div className={styles.taskTitleRow}>

                        <h3 className={styles.taskTitle}>
                            {task.title}
                        </h3>

                        <span
                            className={`${styles.statusBadge} ${
                                statusClass[task.status] || ""
                            }`}
                        >
                            {statusLabels[task.status] || task.status}
                        </span>

                    </div>

                    <p className={styles.taskDescription}>
                        {task.description || "Aucune description"}
                    </p>

                </div>

                <div
                    className={styles.taskMenuWrapper}
                    ref={menuOpen ? menuRef : null}
                >
                    <button
                        type="button"
                        className={styles.taskMenuButton}
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        ...
                    </button>

                    {menuOpen && (
                        <div className={styles.taskMenuDropdown}>
                            <button
                                type="button"
                                className={styles.taskMenuItem}
                                onClick={() => {
                                    setMenuOpen(false);
                                    setModalOpenModif(true);
                                }}
                            >
                                Modifier
                            </button>

                            <button
                                type="button"
                                className={`${styles.taskMenuItem} ${styles.taskMenuItemDelete}`}
                                onClick={() => {
                                    setMenuOpen(false);
                                    handleDeleteTask();
                                }}
                            >
                                Supprimer
                            </button>
                        </div>
                    )}
                </div>

            </div>

            {deleteError && (
                <p className={styles.taskDescription} style={{ color: "#dc2626", padding: "0 16px" }}>
                    {deleteError}
                </p>
            )}

            <div className={styles.taskDetails}>

                <div className={styles.dueDate}>
                    <span>Échéance :</span>

                    <Image
                        src="/calendar.svg"
                        alt="calendrier noir"
                        className={styles.dueDateIcon}
                        width={12}
                        height={12}
                    />

                    <strong>
                        {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                              })
                            : "Aucune"}
                    </strong>

                </div>

            </div>

            <div className={styles.assigneesSection}>

                <span className={styles.assigneesLabel}>
                    Assigné à :
                </span>

                <div className={styles.assignees}>

                    {task.assignees?.length > 0 ? (

                        task.assignees.map((assignee) => {

                            const name = assignee.user?.name || "Utilisateur";

                            return (
                                <div className={styles.assignee} key={assignee.id}>
                                    <span className={styles.avatar}>{getInitials(name)}</span>
                                    <span className={styles.assigneeName}>{name}</span>
                                </div>
                            );
                        })

                    ) : (
                        <span className={styles.noAssignee}>Aucun utilisateur assigné</span>
                    )}
                </div>
            </div>

            <CommentsSection
                taskId={task.id}
                projectId={projectId}
                initialCount={task.comments?.length || 0}
            />

        </article>
    );
}
