/**
 * Fonction de récupération des commentaires.
 * @param {*} taskId
 * @param {*} projectId
 * @returns
 */
export async function getComments(taskId, projectId) {

    const params = new URLSearchParams({ taskId, projectId });

    const response = await fetch(`/api/comments/getComments?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
            data.message || "Impossible de récupérer les commentaires."
        );
    }

    return data;
}

/**
 * Fonction de suppression d'un commentaire.
 * @param {*} commentId
 * @param {*} taskId
 * @param {*} projectId
 * @returns
 */
export async function removeComment(commentId, taskId, projectId) {

    const response = await fetch(`/api/comments/removeComments`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId, taskId, projectId }),
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(
            data.message || "Impossible de supprimer le commentaire."
        );
    }

    return data;
}