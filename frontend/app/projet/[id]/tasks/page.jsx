"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProjectById } from "@/services/projectServices";
import { getProjectTasks } from "@/services/taskServices";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/modal/Modal.js";
import styles from "./tasks.module.css";
import Image from "next/image";
import { getInitials } from "@/utils/utils";
import ProjectFormModif from "@/components/projectFormModif/ProjectFormModif";
import { removeProject } from "@/services/projectServices";

export default function TasksPage() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const [modalOpenModif, setModalOpenModif] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenIA, setModalOpenIA] = useState(false);

    /* pour edit boutton */
    const isOwner = project?.owner?.id != null && project.owner.id === user?.id;

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
                setError(err.message ||"Impossible de récupérer les informations du projet.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    /* Gestion de la suppression */
    const handleDeleteProject = async () => {

        const confirmed = window.confirm(
            "Es-tu sûr de vouloir supprimer ce projet ? Cette action est irréversible."
        );

        if (!confirmed) {
            return;
        }

        try {
            await removeProject(project.id);
            router.push("/projet");
        } catch (err) {
            console.error(err);
            setError(err.message || "Impossible de supprimer le projet.");
        }
    };

    /* Gestion des modals */
    const handleModifProject = (data) => {
        setProject((prevProject) => ({
            ...prevProject,
            name: data.name,
            description: data.description,
            members: data.contributors.map((contributor) => ({
                id: contributor.id,
                user: contributor,
            })),
        }));

        setModalOpenModif(false);
    };

    const handleCreateTask = (data) => {
        console.log(data);
        setModalOpenModif(false);
    };

    const handleCreateTaskIA = (data) => {
        console.log(data);
        setModalOpenModif(false);
    };

    /* Gestion des status et tags */
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

    return (
        <main className={styles.container}>

            {/* Gestion des modals */}

            <Modal
                isOpen={modalOpenModif}
                onClose={() => setModalOpenModif(false)}
                title="Modifier"
            >
                <ProjectFormModif
                    project={project}
                    onSubmit={handleModifProject}
                />

            </Modal>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer une tâche"
            >

            </Modal>

            <Modal
                isOpen={modalOpenIA}
                onClose={() => setModalOpenIA(false)}
                title="IA Créer une tâche"
            >

            </Modal>

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

                        <div className={styles.containerButtonModif}>
                            <h1 className={styles.projectTitle}>
                                {project?.name || "Projet"}
                            </h1>

                            {isOwner && (
                                <>
                                    <button
                                        className={styles.editButton}
                                        onClick={() => setModalOpenModif(true)}
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        className={styles.editButton}
                                        onClick={handleDeleteProject}
                                    >
                                        Supprimer
                                    </button>
                                </>
                            )}
                        </div>

                        <p className={styles.projectDescription}>
                            {project?.description || "Aucune description disponible."}
                        </p>
                    </div>
                </div>

                <div className={styles.projectActions}>

                    <button type="button" className={styles.createTaskButton} onClick={() => setModalOpen(true)}>
                        Créer une tâche
                    </button>

                    <button type="button" className={styles.aiButton} onClick={() => setModalOpenIA(true)}>
                        ✦ IA
                    </button>
                </div>

            </header>

            {/* CONTRIBUTOR */}
            <section className={styles.contributor}>

                <div className={styles.numberContributor}>
                    <p>Contributeurs</p>
                    <span className={styles.number}>{(project?.members?.length ?? 0) + 1} personnes</span>
                </div>

                <div className={styles.assignees}>

                    <div className={styles.assignee}>
                        <span className={styles.avatarOrange}>{getInitials(project?.owner?.name)}</span>
                        <span className={styles.assigneeNameOrange}>{project?.owner?.name}</span>
                    </div>

                    {project?.members?.length > 0 ? (

                        project.members.map((member) => {

                            const name = member.user?.name || "Utilisateur";

                            return (
                                <div className={styles.assignee} key={member.id}>
                                    <span className={styles.avatar}>{getInitials(name)}</span>
                                    <span className={styles.assigneeName}>{name}</span>
                                </div>
                            );
                        })

                    ) : (
                        <span className={styles.noAssignee}>Aucun utilisateur assigné</span>
                    )}

                </div>

            </section>

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

                        <button  type="button" className={styles.toolbarButtonActive}>
                            <Image
                                src="/tcheck_orange.svg"
                                alt="tcheck orange"
                                className={styles.dueDateIcon}
                                width={12}
                                height={12}
                            />
                            Liste
                        </button>

                        <button type="button" className={styles.toolbarButton}>
                            <Image
                                src="/calendar_orange.svg"
                                alt="calendrier orange"
                                className={styles.dueDateIcon}
                                width={12}
                                height={12}
                            />
                            Calendrier
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
                        <p>Aucune tâche pour ce projet.</p>
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

                                            </div>

                                            <p className={styles.taskDescription}>
                                                {task.description || "Aucune description"}    
                                            </p>

                                        </div>

                                        <button type="button" className={styles.taskMenuButton}>
                                            ...
                                        </button>

                                    </div>

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

                                                task.assignees.map((assignee) => {

                                                        const name = assignee.user?.name ||"Utilisateur";

                                                        return (
                                                            <div className={styles.assignee} key={assignee.id}>
                                                                <span className={styles.avatar}>{getInitials(name)}</span>
                                                                <span className={styles.assigneeName}>{name}</span>
                                                            </div>
                                                        );
                                                    }
                                                )

                                            ) : (
                                                <span className={styles.noAssignee}>Aucun utilisateur assigné</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.commentsSection}>
                                        <span>Commentaires ({task.comments?.length || 0})</span>
                                        <span className={styles.commentsArrow}>⌃</span>
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
