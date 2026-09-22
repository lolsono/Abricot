"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./TasksForm.module.css";
import UserSelector from "../autocompletion/autocompletion.js"
import { createTask } from "@/services/taskServices";

const STATUS_OPTIONS = [
    { value: "TODO", label: "À faire" },
    { value: "IN_PROGRESS", label: "En cours" },
    { value: "DONE", label: "Terminée" },
];

export default function TasksForm({ projectId, onSubmit }) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("TODO");
    const [contributors, setContributors] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const isValid =
        name.trim() !== "" &&
        description.trim() !== "" &&
        dueDate.trim() !== "";

    async function handleSubmit (event) {

        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const data = await createTask(projectId, {
                title: name,
                description,
                status,
                priority: "MEDIUM",
                dueDate: new Date(dueDate).toISOString(),
                assigneeIds: contributors.map((contributor) => contributor.id),
            });

            setSuccessMessage("Tâche crée avec succès !");

            if (onSubmit) {
                onSubmit(data);
            }

            setName("");
            setDescription("");
            setDueDate("");
            setStatus("TODO");
            setContributors([]);

        } catch (error) {
            console.error(error.message);
            setErrorMessage(error.message);
        }
    };

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

            <button
                type="submit"
                className={styles.submitButton}
                disabled={!isValid}
            >
                + Ajouter une tâche
            </button>

        </form>
    );
}