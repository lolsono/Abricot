import { NextResponse } from "next/server";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

export async function POST(request) {
  try {
    const { description } = await request.json();

    if (!description || !description.trim()) {
      return NextResponse.json({ error: "Description manquante" }, { status: 400 });
    }

    const systemPrompt = `Tu es un assistant de gestion de projet.
À partir de la demande de l'utilisateur, crée la liste des tâches à réaliser.
Réponds UNIQUEMENT avec un JSON de cette forme :
{"tasks":[{"title":"string","description":"string","priority":"LOW|MEDIUM|HIGH","dueDate":"date ISO 8601 ou null"}]}
Règles : titres courts, descriptions d'une phrase, dueDate à null si aucune date n'est demandée.
Date du jour : ${new Date().toISOString()}`;

    const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: description }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        }),
      }
    );

    if (!res.ok) {
      const details = await res.text();
      console.error("Erreur Gemini :", details);
      return NextResponse.json({ error: "Erreur du service IA" }, { status: 502 });
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(text);

    // Nettoyage : on ne fait jamais confiance aveuglément à l'IA
    const tasks = (parsed.tasks || [])
      .filter((t) => t.title)
      .map((t) => ({
        title: String(t.title).trim(),
        description: String(t.description || "").trim(),
        priority: PRIORITIES.includes(t.priority) ? t.priority : "LOW",
        dueDate: t.dueDate && !isNaN(Date.parse(t.dueDate))
          ? new Date(t.dueDate).toISOString()
          : null,
      }));

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}