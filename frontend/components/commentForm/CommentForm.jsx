"use client";

import { useState } from "react";
import styles from "./CommentForm.module.css";

export default function CommentForm({ onSubmit }) {

    const [content, setContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const isValid = content.trim() !== "";

    async function handleSubmit(event) {

        event.preventDefault();
        setErrorMessage("");

        if (!isValid || submitting) return;

        setSubmitting(true);

        try {
            await onSubmit(content.trim());
            setContent("");
        } catch (error) {
            console.error(error.message);
            setErrorMessage(error.message || "Impossible d'ajouter le commentaire.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.formGroup}>
                <label htmlFor="comment-content">
                    Commentaire<span>*</span>
                </label>

                <textarea
                    id="comment-content"
                    className={styles.textarea}
                    rows={4}
                    placeholder="Écris ton commentaire..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            {errorMessage && (
                <p className={styles.errorMessage}>
                    {errorMessage}
                </p>
            )}

            <button
                type="submit"
                className={styles.submitButton}
                disabled={!isValid || submitting}
            >
                {submitting ? "Envoi..." : "Envoyer"}
            </button>

        </form>
    );
}
