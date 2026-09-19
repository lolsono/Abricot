import { NextResponse } from "next/server";

/**
 * Fonction de réccupération des tâches.
 * @param {*} id
 * @returns
 */
export async function GET(request, { params }) {
    try {
        const { projectId } = await params;
        const token = request.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Utilisateur non authentifié" },
                { status: 401 }
            );
        }

        const response = await fetch(
            `${process.env.API_URL}/projects/${projectId}/tasks`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: data.message || "Session invalide" },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des tâches :", error);
        return NextResponse.json(
            { success: false, message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}