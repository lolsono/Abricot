export async function searchUsers(search) {

    const response = await fetch(
        `/api/user/search?query=${encodeURIComponent(search)}`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Impossible de récupérer les utilisateurs");
    }

    return response.json();
}
