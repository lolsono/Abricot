"use client";

import { useState } from "react";
import styles from "./TaskCardIA.module.css";

const PRIORITY_LABELS = { LOW: "Basse", MEDIUM: "Moyenne", HIGH: "Haute" };

export default function TaskCardIA({ task, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);

    const handleSave = () => {
        if (!title.trim()) return;
        onUpdate({ ...task, title: title.trim(), description: description.trim() });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTitle(task.title);
        setDescription(task.description);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <li className={styles.card}>
                <input
                    className={styles.editInput}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-label="Nom de la tâche"
                />
                <textarea
                    className={styles.editTextarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    aria-label="Description de la tâche"
                    rows={3}
                />
                <div className={styles.actions}>
                    <button type="button" className={styles.saveButton} onClick={handleSave}>
                        Enregistrer
                    </button>
                    <button type="button" className={styles.actionButton} onClick={handleCancel}>
                        Annuler
                    </button>
                </div>
            </li>
        );
    }

    return (
        <li className={styles.card}>
            <h3 className={styles.title}>{task.title}</h3>
            {task.description && <p className={styles.description}>{task.description}</p>}

            <div className={styles.meta}>
                <span className={styles.badge}>{PRIORITY_LABELS[task.priority] ?? task.priority}</span>
                {task.dueDate && (
                    <span className={styles.badge}>
                        {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                    </span>
                )}
            </div>

            <div className={styles.actions}>
                <button type="button" className={styles.actionButton} onClick={() => onDelete(task.tempId)}>
                    Supprimer
                </button>
                <span className={styles.separator} aria-hidden="true" />
                <button type="button" className={styles.actionButton} onClick={() => setIsEditing(true)}>
                    Modifier
                </button>
            </div>
        </li>
    );
}