import { NextResponse } from "next/server";

export async function PUT(request) {
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

        const {
            taskId,
            projectId,
            title,
            description,
            status,
            priority,
            dueDate,
            assigneeIds,
        } = await request.json();

        console.log(taskId, projectId);

        const response = await fetch(
            `${process.env.API_URL}/projects/${projectId}/tasks/${taskId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    taskId,
                    projectId,
                    title,
                    description,
                    status,
                    priority,
                    dueDate,
                    assigneeIds,
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
                        "Impossible de modifier la tâches.",
                },
                {
                    status: response.status,
                }
            );
        }

        return NextResponse.json(data);

    } catch (error) {

        console.error(
            "Erreur lors de la modification de la tâche :",
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
