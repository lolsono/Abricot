"use client";

import { useState } from "react";
import styles from "./TasksFormIA.module.css";

export default function TasksFormIA() {
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!description.trim()) return;

        console.log("Nouvelle tâche :", description);

        // Ici tu pourras appeler ton API
        // await fetch("/api/tasks", ...)

        setDescription("");
    };

    return (
        <div className={styles.container}>

            {/* Titre */}
            <div className={styles.title}>
                <span className={styles.sparkle}>✦</span>
                <h1>Créer une tâche</h1>
            </div>

            {/* Formulaire */}
            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez les tâches que vous souhaitez ajouter..."
                    className={styles.input}
                />

                <button
                    type="submit"
                    className={styles.submitButton}
                    aria-label="Ajouter"
                >
                    +
                </button>
            </form>

        </div>
    );
}
