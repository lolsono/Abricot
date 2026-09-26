"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/modal/Modal.js";
import ProjectForm from "@/components/projectForm/ProjectForm.js";
import ViewToggle from "@/components/dashboard/ViewToggle/ViewToggle";
import KanbanBoard from "@/components/dashboard/KanbanBoard/KanbanBoard";
import TaskListView from "@/components/dashboard/TaskListView/TaskListView";
import { getAssignedTasks } from "@/services/dashboardServices";

export default function DashboardPage() {

    const router = useRouter();
    const { user } = useAuth();

    const [view, setView] = useState("kanban");
    const [modalOpen, setModalOpen] = useState(false);

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError(null);

                const result = await getAssignedTasks();
                setTasks(result.data?.tasks || []);
            } catch (err) {
                console.error(err);
                setError(err.message || "Impossible de récupérer les tâches assignées.");
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const handleCreateProject = (data) => {
        const newProject = data?.data?.project;
        console.log("Projet créé :", newProject);
        setModalOpen(false);
    };

    const handleViewTask = (task) => {
        if (task.project?.id) {
            router.push(`/projet/${task.project.id}/tasks`);
        }
    };

    return (
        <main className={styles.container}>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer un projet"
            >
                <ProjectForm onSubmit={handleCreateProject} />
            </Modal>

            <header className={styles.header}>

                <div>
                    <h1 className={styles.title}>
                        Tableau de bord
                    </h1>
                    <p className={styles.subtitle}>
                        Bonjour {user?.name || "à toi"}, voici un aperçu de vos projets et tâches
                    </p>
                </div>

                <button
                    type="button"
                    className={styles.createButton}
                    onClick={() => setModalOpen(true)}
                >
                    + Créer un projet
                </button>

            </header>

            <div className={styles.toggleRow}>
                <ViewToggle view={view} onChange={setView} />
            </div>

            {loading && (
                <p className={styles.message}>
                    Chargement des tâches...
                </p>
            )}

            {!loading && error && (
                <p className={styles.error}>
                    {error}
                </p>
            )}

            {!loading && !error && view === "kanban" && (
                <KanbanBoard tasks={tasks} onViewTask={handleViewTask} />
            )}

            {!loading && !error && view === "list" && (
                <TaskListView tasks={tasks} onViewTask={handleViewTask} />
            )}

        </main>
    );
}
