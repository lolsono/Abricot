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
import TasksForm from "@/components/tasksForm/TasksForm";
import TaskCard from "@/components/TaskCards/TaskCard";
import TasksFormIA from "@/components/tasksFormIA/TasksFormIA";
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

    /* Gestion de la suppression du projet */
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
        setTasks((prevTasks) => [...prevTasks, data.data.task]);
        setModalOpen(false);
    };

    const handleCreateTaskIA = (data) => {
        console.log(data);
        setModalOpenModif(false);
    };

    /* Remplace la tâche modifiée dans la liste, pour rafraîchir l'affichage de sa card */
    const handleTaskUpdated = (data) => {
        const updatedTask = data?.data?.task;

        if (!updatedTask) return;

        setTasks((prevTasks) =>
            prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        );
    };

    /* Retire simplement la tâche du state une fois supprimée côté TaskCard */
    const handleTaskDeleted = (taskId) => {
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
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
                <TasksForm
                    projectId={project?.id}
                    onSubmit={handleCreateTask}
                />
            </Modal>

            <Modal
                isOpen={modalOpenIA}
                onClose={() => setModalOpenIA(false)}
                title="IA Créer une tâche"
            >
                <TasksFormIA />
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

                        <div className={styles.projectTopRow}>

                            <h1 className={styles.projectTitle}>
                                {project?.name || "Projet"}
                            </h1>

                            {isOwner && (
                                <div className={styles.containerButtonModif}>
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
                                </div>
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

                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                projectId={project?.id}
                                onEdit={handleTaskUpdated}
                                onDelete={handleTaskDeleted}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
