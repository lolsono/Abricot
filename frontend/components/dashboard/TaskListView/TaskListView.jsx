"use client";

import { useMemo, useState } from "react";
import styles from "./TaskListView.module.css";
import TaskSummaryCard from "../TaskSummaryCard/TaskSummaryCard";

export default function TaskListView({ tasks, onViewTask }) {

    const [search, setSearch] = useState("");

    const filteredTasks = useMemo(() => {

        const query = search.trim().toLowerCase();

        if (!query) return tasks;

        return tasks.filter((task) =>
            task.title?.toLowerCase().includes(query) ||
            task.description?.toLowerCase().includes(query) ||
            task.project?.name?.toLowerCase().includes(query)
        );
    }, [tasks, search]);

    return (
        <div className={styles.container}>

            <div className={styles.header}>

                <div>
                    <h2 className={styles.title}>
                        Mes tâches assignées
                    </h2>
                    <p className={styles.subtitle}>
                        Par ordre de priorité
                    </p>
                </div>

                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Rechercher une tâche"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            <div className={styles.list}>

                {filteredTasks.length === 0 && (
                    <p className={styles.emptyState}>
                        Aucune tâche ne correspond à ta recherche.
                    </p>
                )}

                {filteredTasks.map((task) => (
                    <TaskSummaryCard
                        key={task.id}
                        task={task}
                        variant="list"
                        onView={onViewTask}
                    />
                ))}

            </div>

        </div>
    );
}
