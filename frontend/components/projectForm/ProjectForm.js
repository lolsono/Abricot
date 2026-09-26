"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./ProjectForm.module.css";
import UserSelector from "../autocompletion/autocompletion.js"
import { createProject } from "@/services/projectServices";

export default function ProjectForm({ onSubmit }) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [contributors, setContributors] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    async function handleSubmit (event) {

        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const contributorEmails = contributors.map(
                (contributor) => contributor.email
            );

            const data = await createProject(name, description, contributorEmails);

            setSuccessMessage("Projet crée avec succès !");

            if (onSubmit) {
                onSubmit(data);
            }

            setName("");
            setDescription("");
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
                <label>Contributeurs</label>
                <UserSelector
                    value={contributors}
                    onChange={setContributors}
                />
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
            >
                Ajouter un projet
            </button>

        </form>
    );
}
