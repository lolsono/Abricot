
/**
 * Fonction de connexion utilisateur.
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
export async function login(email, password) {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Erreur lors de la connexion"
        );
    }

    return data;
}

/**
 * Récup info utilisateur
 */
export async function getCurrentUser() {
    const response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Utilisateur non authentifié"
        );
    }

    return data;
}
