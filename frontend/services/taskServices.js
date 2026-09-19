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