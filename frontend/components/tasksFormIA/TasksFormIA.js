"use client";

import { useState } from "react";
import styles from "./TasksFormIA.module.css";
import TaskCardIA from "../TaskCards/TaskCard";
import { generateTasksFromPrompt, createTasks } from "@/services/aiTaskService";

export default function TasksFormIA({ projectId, onClose, onCreated }) {
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const hasTasks = tasks.length > 0;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!description.trim() || loading || saving) return;

    setLoading(true);
    setError("");

    try {
      const newTasks = await generateTasksFromPrompt(description, {
        projectId,
      });
      setTasks((prev) => [...prev, ...newTasks]); // on ajoute à la liste existante
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (tempId) => {
    setTasks((prev) => prev.filter((t) => t.tempId !== tempId));
  };

  const handleUpdate = (updated) => {
    setTasks((prev) =>
      prev.map((t) => (t.tempId === updated.tempId ? updated : t)),
    );
  };

  const handleConfirm = async () => {
    setSaving(true);
    setError("");

    const { created, failed } = await createTasks(projectId, tasks);

    // On envoie à la page les tâches réellement créées
    if (created.length > 0) {
      onCreated?.(created);
    }

    if (failed.length === 0) {
      onClose?.();
    } else {
      setTasks(failed);
      setError(
        `${failed.length} tâche(s) n'ont pas pu être créées. Vous pouvez réessayer.`,
      );
    }

    setSaving(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.sparkle} aria-hidden="true">
          ✦
        </span>
        <h1 className={styles.heading}>
          {hasTasks ? "Vos tâches..." : "Créer une tâche"}
        </h1>
      </header>

      <div className={styles.body}>
        {hasTasks && (
          <ul className={styles.list}>
            {tasks.map((task) => (
              <TaskCardIA
                key={task.tempId}
                task={task}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </ul>
        )}

        {loading && (
          <p className={styles.status}>Génération des tâches en cours…</p>
        )}
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </div>

      {hasTasks && (
        <div className={styles.confirmRow}>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={handleConfirm}
            disabled={saving || loading}
          >
            {saving ? "Ajout en cours…" : "+ Ajouter les tâches"}
          </button>
        </div>
      )}

      <form className={styles.footer} onSubmit={handleGenerate}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            aria-label="Décrire les tâches à créer"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez les tâches que vous souhaitez ajouter..."
            className={styles.input}
            disabled={loading || saving}
          />
          <button
            type="submit"
            className={styles.sendButton}
            aria-label="Générer les tâches"
            disabled={loading || saving || !description.trim()}
          >
            ✦
          </button>
        </div>
      </form>
    </div>
  );
}
