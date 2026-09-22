"use client";

import { useState, useEffect } from "react";
import styles from "./TasksFormModif.module.css";
import UserSelector from "../autocompletion/autocompletion.js";
import { modifTask } from "@/services/taskServices";

const STATUS_OPTIONS = [
    { value: "TODO", label: "À faire" },
    { value: "IN_PROGRESS", label: "En cours" },
    { value: "DONE", label: "Terminée" },
];

export default function TasksFormModif({ projectId, task, onSubmit }) {

    // Initialise les états avec les données de `task`
    const [name, setName] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [dueDate, setDueDate] = useState(
        task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
    );
    const [status, setStatus] = useState(task?.status || "TODO");
    const [contributors, setContributors] = useState(
        task?.assignees?.map((assignee) => assignee.user) || []
    );
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [noChanges, setNoChanges] = useState(false);

    // Stocke les valeurs initiales pour comparer les modifications
    const initialValues = {
        title: task?.title || "",
        description: task?.description || "",
        dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        status: task?.status || "TODO",
        assignees: task?.assignees?.map((assignee) => assignee.user) || [],
    };

    // Met à jour les champs si `task` change
    useEffect(() => {
        if (task) {
            setName(task.title || "");
            setDescription(task.description || "");
            setDueDate(
                task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
            );
            setStatus(task.status || "TODO");
            setContributors(task.assignees?.map((assignee) => assignee.user) || []);
        }
    }, [task]);

    const isValid =
        name.trim() !== "" &&
        description.trim() !== "" &&
        dueDate.trim() !== "";

    // Vérifie si au moins un champ a changé
    const hasChanges = () => {
        return (
            name !== initialValues.title ||
            description !== initialValues.description ||
            dueDate !== initialValues.dueDate ||
            status !== initialValues.status ||
            JSON.stringify(contributors) !== JSON.stringify(initialValues.assignees)
        );
    };

    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setNoChanges(false);

        if (!hasChanges()) {
            setNoChanges(true);
            return;
        }

        try {
            const data = await modifTask(task.id, projectId, {
                title: name,
                description,
                status,
                priority: "MEDIUM",
                dueDate: new Date(dueDate).toISOString(),
                assigneeIds: contributors.map((contributor) => contributor.id),
            });

            setSuccessMessage("Tâche modifiée avec succès !");
            if (onSubmit) {
                onSubmit(data);
            }
        } catch (error) {
            console.error(error.message);
            setErrorMessage(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="title">
                    Titre<span>*</span>
                </label>
                <input
                    id="title"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description">
                    Description<span>*</span>
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="dueDate">
                    Échéance<span>*</span>
                </label>
                <input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Assigné à :</label>
                <UserSelector
                    value={contributors}
                    onChange={setContributors}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Statut :</label>
                <div className={styles.statusOptions}>
                    {STATUS_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`${styles.statusPill} ${
                                styles[`status${option.value}`]
                            } ${
                                status === option.value
                                    ? styles.statusPillActive
                                    : ""
                            }`}
                            onClick={() => setStatus(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {errorMessage && (
                <p className={styles.errorMessage}>
                    {errorMessage}
                </p>
            )}

            {successMessage && (
                <p className={styles.successMessage}>
                    {successMessage}
                </p>
            )}

            {noChanges && (
                <p className={styles.errorMessage}>
                    Aucune modification détectée.
                </p>
            )}

            <button
                type="submit"
                className={styles.submitButton}
                disabled={!isValid}
            >
                Enregistrer
            </button>
        </form>
    );
}