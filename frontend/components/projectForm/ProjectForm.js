"use client";

import { useState } from "react";
import styles from "./ProjectForm.module.css";
import UserSelector from "../autocompletion/autocompletion.js"

export default function ProjectForm({ onSubmit }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [contributors, setContributors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit({
            title,
            description,
            contributors,
        });
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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

            <UserSelector
                value={contributors}
                onChange={setContributors}
            />

            <button
                type="submit"
                className={styles.submitButton}
            >
                Ajouter un projet
            </button>

        </form>
    );
}
