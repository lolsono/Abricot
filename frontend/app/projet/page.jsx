"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./projet.module.css";
import Image from "next/image";
import Modal from "@/components/modal/Modal.js";
import ProjectForm from "@/components/projectForm/ProjectForm.js";
import { getProject } from "@/services/projectServices";
import { getInitials } from "@/utils/utils";

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
        const newProject = data?.data?.project;

        if (newProject) {
            setProjects((prevProjects) => [...prevProjects, newProject]);
        }

        setModalOpen(false);
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
                                        <Image
                                            src="/member_logo.svg"
                                            alt="Abricot"
                                            className={styles.logoMember}
                                            width={11}
                                            height={11}
                                        />
                                        <span>Équipe</span>
                                        <span>
                                            ({project.members?.length + 1 || 1})
                                        </span>
                                    </div>

                                    <div className={styles.teamMembers}>

                                        <div className={styles.avatarOwner}>
                                            {getInitials(project.owner.name)}
                                        </div>
                                        <span className={styles.ownerBadge}>Propriétaire</span>

                                        {project.members?.map((member) => {

                                            return (
                                                <div
                                                    className={styles.memberWrapper}
                                                    key={member.id}
                                                >
                                                    <div className={styles.avatar}>
                                                        {getInitials(member.user?.name)}
                                                    </div>

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
