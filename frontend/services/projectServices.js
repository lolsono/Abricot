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