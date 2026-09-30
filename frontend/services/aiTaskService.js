import { createTask } from "@/services/taskServices";

/**
 * Transforme une tâche de la modale IA en payload attendu par la route.
 * Pas de tempId, projectId (passé à part), creatorId ni comments.
 */
function buildTaskPayload(task) {
  const payload = {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assignees: task.assignees ?? [],
  };

  if (task.dueDate) {
    payload.dueDate = task.dueDate;
  }

  return payload;
}

/**
 * Crée plusieurs tâches issues de la modale IA.
 * @returns {Promise<{ created: Array, failed: Array }>}
 *   failed contient les tâches d'origine, pour réessayer sans doublons.
 */
export async function createTasks(projectId, tasks) {
  const created = [];
  const failed = [];

  // Une par une, pour garder l'ordre et ne pas surcharger l'API
  for (const task of tasks) {
    try {
      const data = await createTask(projectId, buildTaskPayload(task));
      created.push(data);
    } catch (error) {
      console.error(`Échec de création de "${task.title}" :`, error);
      failed.push(task);
    }
  }

  return { created, failed };
}

/**
 * Envoie la demande à la route serveur IA et renvoie des tâches
 * au format de ton site, prêtes à être affichées dans la modale.
 */
export async function generateTasksFromPrompt(
  description,
  { projectId, creatorId },
) {
  const response = await fetch("/api/ai/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Impossible de générer les tâches");
  }

  return (data.tasks ?? []).map((aiTask) =>
    mapAiTaskToTask(aiTask, { projectId, creatorId }),
  );
}

function mapAiTaskToTask(aiTask, { projectId, creatorId }) {
  return {
    tempId: crypto.randomUUID(),
    title: aiTask.title,
    description: aiTask.description,
    status: "TODO",
    priority: aiTask.priority,
    dueDate: aiTask.dueDate,
    projectId,
    creatorId,
    assignees: [],
    comments: [],
  };
}
