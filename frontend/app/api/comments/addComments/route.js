import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const token = request.cookies.get("auth_token")?.value;

        // Aucun token = utilisateur non authentifié
        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Utilisateur non authentifié",
                },
                {
                    status: 401,
                }
            );
        }

        const { taskId, projectId, content } = await request.json();

        if (!taskId || !projectId || !content?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "taskId, projectId et content sont requis.",
                },
                {
                    status: 400,
                }
            );
        }

        const response = await fetch(
            `${process.env.API_URL}/projects/${projectId}/tasks/${taskId}/comments`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
                cache: "no-store",
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || "Ajout du commentaire impossible",
                },
                {
                    status: response.status,
                }
            );
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error(
            "Erreur lors de l'ajout du commentaire :",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Erreur interne du serveur",
            },
            {
                status: 500,
            }
        );
    }
}