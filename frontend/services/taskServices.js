/**
 * Fonction de récupération des tâches.
 * @param {*} projectId
 * @returns
 */
export async function getProjectTasks(projectId) {

    if (!projectId) {
        throw new Error("L'identifiant du projet est obligatoire.");
    }

    const response = await fetch(`/api/project/${projectId}/tasks`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
            data.message || "Impossible de récupérer les tâches."
        );
    }

    return data;
}

/**
 * Fonction de création de tâche.
 * @param {*} projectId
 * @param {*} payload - { title, description, status, priority, dueDate, assignees }
 * @returns
 */
export async function createTask(projectId, payload) {

    const response = await fetch("/api/tasks/createTasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            projectId,
            ...payload,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Erreur lors de la création"
        );
    }

    return data;
}

/**
 * Fonction de modification de la tâche.
 * @param {*} taskId
 * @param {*} projectId
 * @param {*} payload - { title, description, status, priority, dueDate, assignees }
 * @returns
 */
export async function modifTask(taskId, projectId, payload) {

    const response = await fetch("/api/tasks/modifTasks", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            taskId,
            projectId,
            ...payload,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Erreur lors de la création"
        );
    }

    return data;
}

/**
 * Fonction de modification de la tâche.
 * @param {*} taskId
 * @param {*} projectId
 * @returns
 */
export async function removeTask(taskId, projectId) {

    const response = await fetch("/api/tasks/deleteTasks", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            taskId,
            projectId,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Erreur lors de la suppression"
        );
    }

    return data;
}