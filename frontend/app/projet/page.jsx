"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./projet.module.css";
import Modal from "@/components/modal/Modal.js";
import ProjectForm from "@/components/projectForm/ProjectForm.js";
import { getProject } from "@/services/projectServices";

export default function Projet() {
    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchProjects = async () => {
            try {
                setLoading(true);
                const result = await getProject();
                setProjects(result.data?.projects || []);
            } catch (error) {
                console.error(error);
                setError("Impossible de récupérer les projets.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleCreateProject = (data) => {
        console.log(data);
        setModalOpen(false);
    };

    const getInitials = (name) => {
        if (!name) {
            return "?";
        }

        const words = name.trim().split(/\s+/);

        if (words.length >= 2) {
            return (
                words[0][0] +
                words[words.length - 1][0]
            ).toUpperCase();
        }

        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className={styles.containerProject}>

            <div className={styles.headerProject}>

                <div>
                    <h2>Mes projets</h2>
                    <p>Gérez vos projets</p>
                </div>

                <button
                    className={styles.createButton}
                    onClick={() => setModalOpen(true)}
                >
                    + Créer un projet
                </button>

            </div>


            {loading && (
                <p className={styles.message}>Chargement des projets...</p>
            )}

            {error && (
                <p className={styles.error}>
                    {error}
                </p>
            )}

            {!loading &&
                !error &&
                projects.length === 0 && (
                    <div className={styles.emptyState}>
                        Aucun projet pour le moment.
                    </div>
                )}

            {!loading &&
                !error &&
                projects.length > 0 && (

                <div className={styles.projectsGrid}>

                    {projects.map((project) => {

                        const progress = 0;
                        const completedTasks = 0;
                        const totalTasks = 2;

                        return (
                            <div
                                className={styles.projectCard}
                                key={project.id}
                                onClick={() => router.push(`/projet/${project.id}/tasks`)}
                                role="button"
                                tabIndex={0}

                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        router.push(`/projet/${project.id}/tasks`);
                                    }
                                }}
                            >

                                <div className={styles.projectHeader}>
                                    <h3>{project.name}</h3>
                                    <p>{project.description}</p>
                                </div>

                                <div className={styles.progressSection}>

                                    <div className={styles.progressHeader}>
                                        <span>Progression</span>
                                        <span>{progress}%</span>
                                    </div>

                                    <div className={styles.progressBar}>

                                        <div
                                            className={styles.progressValue}
                                            style={{width: `${progress}%`,}}
                                        />

                                    </div>

                                    <span className={styles.tasks}>
                                        {completedTasks}/{totalTasks} tâches terminées
                                    </span>

                                </div>

                                <div className={styles.teamSection}>

                                    <div className={styles.teamTitle}>
                                        <span>👥 Équipe</span>
                                        <span>
                                            ({project.members?.length || 0})
                                        </span>
                                    </div>

                                    <div className={styles.teamMembers}>

                                        {project.members?.map((member) => {

                                            const isOwner =
                                                member.role === "OWNER";

                                            return (
                                                <div
                                                    className={styles.memberWrapper}
                                                    key={member.id}
                                                >

                                                    <div
                                                        className={
                                                            isOwner
                                                                ? styles.avatarOwner
                                                                : styles.avatar
                                                        }
                                                    >
                                                        {getInitials(
                                                            member.user?.name
                                                        )}
                                                    </div>

                                                    {isOwner && (
                                                        <span
                                                            className={
                                                                styles.ownerBadge
                                                            }
                                                        >
                                                            Propriétaire
                                                        </span>
                                                    )}

                                                </div>
                                            );
                                        })}

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>

                )}

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer un projet"
            >
                <ProjectForm
                    onSubmit={handleCreateProject}
                />
            </Modal>

        </div>
    );
}
