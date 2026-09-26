/**
 * Fonction de récupération des tâches assignées à l'utilisateur connecté.
 * @returns
 */
export async function getAssignedTasks() {

    const response = await fetch("/api/dashboard/assignedTask", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
            data.message || "Impossible de récupérer les tâches assignées."
        );
    }

    return data;
}

/**
 * Fonction de récupération des projets dans lesquels l'utilisateur
 * a des tâches assignées.
 * @returns
 */
export async function getProjectsWithTasks() {

    const response = await fetch("/api/dashboard/assignedProject", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
            data.message || "Impossible de récupérer les projets."
        );
    }

    return data;
}