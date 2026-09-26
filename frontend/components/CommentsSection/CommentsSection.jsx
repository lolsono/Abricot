"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CommentsSection.module.css";
import Image from "next/image";
import { getComments, removeComment } from "@/services/commentServices";
import { getInitials } from "@/utils/utils";

export default function CommentsSection({ taskId, projectId, initialCount = 0, refreshKey }) {

    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState(null); // null = jamais chargé
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [deleteError, setDeleteError] = useState("");

    const isFirstRun = useRef(true);

    const fetchComments = async () => {

        setLoading(true);
        setError("");

        try {
            const data = await getComments(taskId, projectId);
            setComments(data?.data?.comments || []);
        } catch (err) {
            console.error(err);
            setError(err.message || "Impossible de récupérer les commentaires.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async () => {

        const nextOpen = !open;
        setOpen(nextOpen);

        // On ne va chercher les commentaires que la première fois qu'on ouvre
        if (nextOpen && comments === null) {
            await fetchComments();
        }
    };

    /* Se recharge quand un commentaire vient d'être ajouté */
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        fetchComments();
    }, [refreshKey]);

    const handleDeleteComment = async (commentId) => {

        const confirmed = window.confirm(
            "Es-tu sûr de vouloir supprimer ce commentaire ?"
        );

        if (!confirmed) return;

        setDeleteError("");
        setDeletingId(commentId);

        try {
            await removeComment(commentId, taskId, projectId);
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentId)
            );
        } catch (err) {
            console.error(err);
            setDeleteError(err.message || "Impossible de supprimer le commentaire.");
        } finally {
            setDeletingId(null);
        }
    };

    const count = comments?.length ?? initialCount;

    return (
        <div className={styles.commentsWrapper}>

            <button
                type="button"
                className={styles.commentsToggle}
                onClick={handleToggle}
            >
                <span>Commentaires ({count})</span>

                <span
                    className={`${styles.commentsArrow} ${
                        open ? styles.commentsArrowOpen : ""
                    }`}
                >
                    ⌃
                </span>
            </button>

            {open && (
                <div className={styles.commentsList}>

                    {loading && (
                        <p className={styles.commentsMessage}>
                            Chargement des commentaires...
                        </p>
                    )}

                    {!loading && error && (
                        <p className={styles.commentsError}>
                            {error}
                        </p>
                    )}

                    {!loading && !error && deleteError && (
                        <p className={styles.commentsError}>
                            {deleteError}
                        </p>
                    )}

                    {!loading && !error && comments?.length === 0 && (
                        <p className={styles.commentsMessage}>
                            Aucun commentaire pour le moment.
                        </p>
                    )}

                    {!loading && !error && comments?.map((comment) => (
                        <div className={styles.comment} key={comment.id}>

                            <span className={styles.commentAvatar}>
                                {getInitials(comment.author?.name)}
                            </span>

                            <div className={styles.commentBody}>

                                <div className={styles.commentHeader}>
                                    <span className={styles.commentAuthor}>
                                        {comment.author?.name || "Utilisateur"}
                                    </span>

                                    {comment.createdAt && (
                                        <span className={styles.commentDate}>
                                            {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                                        </span>
                                    )}
                                </div>

                                <p className={styles.commentContent}>
                                    {comment.content}
                                </p>

                            </div>

                            <button
                                type="button"
                                className={styles.commentDeleteButton}
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={deletingId === comment.id}
                                aria-label="Supprimer le commentaire"
                                title="Supprimer le commentaire"
                            >
                            <Image
                                src="/trash-solid-full.svg"
                                alt="logo poubelle"
                                className={styles.dueDateIcon}
                                width={14}
                                height={14}
                            />
                            </button>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}
