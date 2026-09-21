/**
 * Fonction de création de projet.
 * @param {*} name
 * @param {*} description
 * @param {*} contributors
 * @returns
 */
export async function createProject(name, description, contributors) {

    const response = await fetch("/api/project/createProject", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            description,
            contributors
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
 * Fonction de recherche des projet de l'utilisateur.
 */
export async function getProject() {

    const response = await fetch("/api/project/getProject", {
        method: "GET",
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Erreure lors de la récupération des projets"
        );
    }

    return data;
}

/**
 * Fonction de recherche de projet via l'ID.
 * @param {*} id
 * @returns
 */
export async function getProjectById(id) {
    const result = await getProject();
    const project = result.data?.projects?.find(
        (p) => String(p.id) === String(id)
    );

    if (!project) {
        throw new Error("Projet introuvable.");
    }

    return { data: { project } };
}

/**
 * Fonction de modification de projet.
 * @param {*} projectId
 * @param {*} name
 * @param {*} description
 * @returns
 */
export async function modifProject(projectId, name, description) {
    const response = await fetch("/api/project/modifProject", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            projectId,
            name,
            description
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Impossible de modifier le project;"
        );
    }

    return data;
}

/**
 * Ajout de contributor.
 * @param {*} projectId
 * @param {*} email
 * @returns
 */
export async function addContributor(projectId, email) {

    const response = await fetch("/api/project/modifContributor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            projectId,
            email,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Erreur lors de l ajout du contributor"
        );
    }

    return data;
}

/**
 * Suppression de contributor.
 * @param {*} projectId
 * @param {*} userId
 * @returns
 */
export async function removeContributor(projectId, userId) {

    const response = await fetch("/api/project/deleteContributorProject", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            projectId,
            userId,
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

/**
 * Suppression du projet.
 * @param {*} projectId
 * @returns
 */
export async function removeProject(projectId) {

    const response = await fetch("/api/project/deleteProject", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            projectId
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