"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProjectById } from "@/services/projectServices";
import { getProjectTasks } from "@/services/taskServices";
import styles from "./tasks.module.css";

export default function TasksPage() {
    const { id } = useParams();
    const router = useRouter();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [projectResult, tasksResult] = await Promise.all([
                    getProjectById(id),
                    getProjectTasks(id),
                ]);

                setProject(projectResult.data?.project || null);
                setTasks(tasksResult.data?.tasks || []);
            } catch (err) {
                console.error(err);
                setError(
                    err.message ||
                        "Impossible de récupérer les informations du projet."
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const priorityLabels = {
        LOW: "Basse",
        MEDIUM: "Moyenne",
        HIGH: "Haute",
    };

    const statusLabels = {
        TODO: "À faire",
        IN_PROGRESS: "En cours",
        DONE: "Terminée",
    };

    const priorityClass = {
        LOW: styles.priorityLOW,
        MEDIUM: styles.priorityMEDIUM,
        HIGH: styles.priorityHIGH,
    };

    const statusClass = {
        TODO: styles.statusTODO,
        IN_PROGRESS: styles.statusIN_PROGRESS,
        DONE: styles.statusDONE,
    };

    return (
        <main className={styles.container}>

            <header className={styles.projectHeader}>

                <div className={styles.projectHeaderLeft}>

                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => router.push("/projet")}
                    >
                        ←
                    </button>

                    <div className={styles.projectHeading}>

                        <h1 className={styles.projectTitle}>
                            {project?.name || "Projet"}
                        </h1>

                        <p className={styles.projectDescription}>
                            {project?.description ||
                                "Aucune description disponible."}
                        </p>

                    </div>

                </div>


                <div className={styles.projectActions}>

                    <button
                        type="button"
                        className={styles.createTaskButton}
                    >
                        Créer une tâche
                    </button>

                    <button
                        type="button"
                        className={styles.aiButton}
                    >
                        ✦ IA
                    </button>

                </div>

            </header>

            <section className={styles.tasksContainer}>

                {/* HEADER DES TACHES */}

                <div className={styles.tasksHeader}>

                    <div>
                        <h2 className={styles.tasksTitle}>
                            Tâches
                        </h2>

                        <p className={styles.tasksSubtitle}>
                            Par ordre de priorité
                        </p>
                    </div>


                    <div className={styles.tasksToolbar}>

                        <button
                            type="button"
                            className={styles.toolbarButtonActive}
                        >
                            ☷ Liste
                        </button>

                        <button
                            type="button"
                            className={styles.toolbarButton}
                        >
                            ▣ Calendrier
                        </button>

                        <select
                            className={styles.statusSelect}
                            defaultValue="all"
                        >
                            <option value="all">
                                Statut
                            </option>

                            <option value="TODO">
                                À faire
                            </option>

                            <option value="IN_PROGRESS">
                                En cours
                            </option>

                            <option value="DONE">
                                Terminée
                            </option>
                        </select>

                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Rechercher une tâche"
                        />

                    </div>

                </div>

                {loading && (
                    <p className={styles.message}>
                        Chargement des tâches...
                    </p>
                )}

                {!loading && error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {!loading && !error && tasks.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>
                            Aucune tâche pour ce projet.
                        </p>
                    </div>
                )}


                {/* LISTE DES TACHES */}

                {!loading && !error && tasks.length > 0 && (

                    <div className={styles.taskList}>

                        {tasks.map((task) => {

                            return (

                                <article
                                    key={task.id}
                                    className={styles.taskCard}
                                >
                                    <div className={styles.taskHeader}>

                                        <div className={styles.taskTitleContainer}>

                                            <div className={styles.taskTitleRow}>

                                                <h3 className={styles.taskTitle}>
                                                    {task.title}
                                                </h3>

                                                <span
                                                    className={`${styles.priorityBadge} ${
                                                        priorityClass[
                                                            task.priority
                                                        ] || ""
                                                    }`}
                                                >
                                                    {
                                                        priorityLabels[
                                                            task.priority
                                                        ] || task.priority
                                                    }
                                                </span>

                                            </div>

                                            <p className={styles.taskDescription}>
                                                {task.description ||
                                                    "Aucune description"}
                                            </p>

                                        </div>

                                        <button
                                            type="button"
                                            className={styles.taskMenuButton}
                                        >
                                            ...
                                        </button>

                                    </div>

                                    <div className={styles.taskDetails}>

                                        <span
                                            className={`${styles.statusBadge} ${
                                                statusClass[
                                                    task.status
                                                ] || ""
                                            }`}
                                        >
                                            {
                                                statusLabels[
                                                    task.status
                                                ] || task.status
                                            }
                                        </span>


                                        <div className={styles.dueDate}>

                                            <span className={styles.dueDateIcon}>
                                                ◷
                                            </span>

                                            <span>
                                                Échéance :
                                            </span>

                                            <strong>
                                                {task.dueDate
                                                    ? new Date(
                                                          task.dueDate
                                                      ).toLocaleDateString(
                                                          "fr-FR",
                                                          {
                                                              day: "numeric",
                                                              month: "long",
                                                              year: "numeric",
                                                          }
                                                      )
                                                    : "Aucune"
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                    <div className={styles.assigneesSection}>

                                        <span className={styles.assigneesLabel}>
                                            Assigné à :
                                        </span>

                                        <div className={styles.assignees}>

                                            {task.assignees?.length > 0 ? (

                                                task.assignees.map(
                                                    (assignee) => {

                                                        const name =
                                                            assignee.user?.name ||
                                                            "Utilisateur";

                                                        const initials =
                                                            name
                                                                .trim()
                                                                .split(/\s+/)
                                                                .map(
                                                                    (word) =>
                                                                        word[0]
                                                                )
                                                                .join("")
                                                                .substring(
                                                                    0,
                                                                    2
                                                                )
                                                                .toUpperCase();

                                                        return (

                                                            <div
                                                                className={
                                                                    styles.assignee
                                                                }
                                                                key={
                                                                    assignee.id
                                                                }
                                                            >

                                                                <span
                                                                    className={
                                                                        styles.avatar
                                                                    }
                                                                >
                                                                    {initials}
                                                                </span>

                                                                <span
                                                                    className={
                                                                        styles.assigneeName
                                                                    }
                                                                >
                                                                    {name}
                                                                </span>

                                                            </div>

                                                        );
                                                    }
                                                )

                                            ) : (

                                                <span
                                                    className={
                                                        styles.noAssignee
                                                    }
                                                >
                                                    Aucun utilisateur assigné
                                                </span>

                                            )}

                                        </div>

                                    </div>

                                    <div className={styles.commentsSection}>

                                        <span>
                                            Commentaires (
                                            {task.comments?.length || 0}
                                            )
                                        </span>

                                        <span className={styles.commentsArrow}>
                                            ⌃
                                        </span>

                                    </div>

                                </article>

                            );
                        })}

                    </div>

                )}

            </section>

        </main>
    );
}
