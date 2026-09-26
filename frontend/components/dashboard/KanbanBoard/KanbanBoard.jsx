"use client";

import styles from "./KanbanBoard.module.css";
import TaskSummaryCard from "../TaskSummaryCard/TaskSummaryCard";

const COLUMNS = [
    { status: "TODO", title: "À faire" },
    { status: "IN_PROGRESS", title: "En cours" },
    { status: "DONE", title: "Terminées" },
];

export default function KanbanBoard({ tasks, onViewTask }) {

    return (
        <div className={styles.board}>

            {COLUMNS.map((column) => {

                const columnTasks = tasks.filter(
                    (task) => task.status === column.status
                );

                return (
                    <div className={styles.column} key={column.status}>

                        <div className={styles.columnHeader}>
                            <span>{column.title}</span>
                            <span className={styles.columnCount}>
                                {columnTasks.length}
                            </span>
                        </div>

                        <div className={styles.columnList}>

                            {columnTasks.length === 0 && (
                                <p className={styles.emptyColumn}>
                                    Aucune tâche
                                </p>
                            )}

                            {columnTasks.map((task) => (
                                <TaskSummaryCard
                                    key={task.id}
                                    task={task}
                                    variant="kanban"
                                    onView={onViewTask}
                                />
                            ))}

                        </div>

                    </div>
                );
            })}

        </div>
    );
}
