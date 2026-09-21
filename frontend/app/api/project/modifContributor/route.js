import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const token = request.cookies.get("auth_token")?.value;

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

        const {projectId, email} = await request.json();
        const role = "CONTRIBUTOR";

        const response = await fetch(
            `${process.env.API_URL}/projects/${projectId}/contributors`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    role,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        data.message ||
                        "Impossible d'ajouter le contributor.",
                },
                {
                    status: response.status,
                }
            );
        }

        return NextResponse.json(data);

    } catch (error) {

        console.error(
            "Erreur lors de l'ajout du contirbutor :",
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
