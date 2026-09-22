import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "API Gestionnaire de Projets",
      version: "1.0.0",
      description:
        "API REST pour la gestion de projets, tâches et commentaires avec authentification JWT",
      contact: {
        name: "Support API",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },

    servers: [
      {
        url: "http://localhost:8000",
        description: "Serveur de développement",
      },
      {
        url: "https://api.example.com",
        description: "Serveur de production",
      },
    ],

    tags: [
      {
        name: "Projects",
        description: "Gestion des projets",
      },
      {
        name: "Tasks",
        description: "Gestion des tâches",
      },
      {
        name: "Comments",
        description: "Gestion des commentaires",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT obtenu lors de la connexion",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID unique de l'utilisateur",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email de l'utilisateur",
            },
            name: {
              type: "string",
              description: "Nom de l'utilisateur",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Date de création du compte",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Date de dernière modification",
            },
          },
          required: ["id", "email"],
        },

        Project: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID unique du projet",
            },
            name: {
              type: "string",
              description: "Nom du projet",
            },
            description: {
              type: "string",
              description: "Description du projet",
            },
            ownerId: {
              type: "string",
              description: "ID du propriétaire du projet",
            },
            owner: {
              $ref: "#/components/schemas/User",
            },
            members: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ProjectMember",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["id", "name", "ownerId"],
        },

        ProjectMember: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            role: {
              type: "string",
              enum: ["OWNER", "ADMIN", "CONTRIBUTOR"],
              description: "Rôle de l'utilisateur dans le projet",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            joinedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Task: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID unique de la tâche",
            },
            title: {
              type: "string",
              description: "Titre de la tâche",
            },
            description: {
              type: "string",
              description: "Description de la tâche",
            },
            status: {
              type: "string",
              enum: ["TODO", "IN_PROGRESS", "DONE", "CANCELLED"],
              description: "Statut de la tâche",
            },
            priority: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
              description: "Priorité de la tâche",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Date d'échéance de la tâche",
            },
            projectId: {
              type: "string",
              description: "ID du projet associé",
            },
            creatorId: {
              type: "string",
              description: "ID du créateur de la tâche",
            },
            assignees: {
              type: "array",
              items: {
                $ref: "#/components/schemas/TaskAssignee",
              },
            },
            comments: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Comment",
              },
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: [
            "id",
            "title",
            "status",
            "priority",
            "projectId",
            "creatorId",
          ],
        },

        TaskAssignee: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            userId: {
              type: "string",
            },
            taskId: {
              type: "string",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            assignedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Comment: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID unique du commentaire",
            },
            content: {
              type: "string",
              description: "Contenu du commentaire",
            },
            taskId: {
              type: "string",
              description: "ID de la tâche associée",
            },
            authorId: {
              type: "string",
              description: "ID de l'auteur du commentaire",
            },
            author: {
              $ref: "#/components/schemas/User",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
          required: ["id", "content", "taskId", "authorId"],
        },

        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Message d'erreur",
            },
            error: {
              type: "string",
              description: "Code d'erreur",
            },
            details: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                  },
                  message: {
                    type: "string",
                  },
                },
              },
            },
          },
        },

        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              description: "Message de succès",
            },
            data: {
              type: "object",
              description: "Données de la réponse",
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],

    paths: {
      // ============================================================
      // PROJECTS
      // ============================================================

      "/projects": {
        post: {
          summary: "Créer un nouveau projet",
          description: "Crée un nouveau projet pour l'utilisateur connecté.",
          tags: ["Projects"],
          security: [{ bearerAuth: [] }],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name"],
                  properties: {
                    name: {
                      type: "string",
                      example: "Mon nouveau projet",
                    },
                    description: {
                      type: "string",
                      example: "Description de mon projet",
                    },
                    contributors: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      example: [],
                    },
                  },
                },
              },
            },
          },

          responses: {
            201: {
              description: "Projet créé avec succès",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Project",
                  },
                },
              },
            },
            400: {
              description: "Données invalides",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Error",
                  },
                },
              },
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
          },
        },

        get: {
          summary: "Récupérer tous les projets",
          description:
            "Récupère tous les projets auxquels l'utilisateur connecté a accès.",
          tags: ["Projects"],
          security: [{ bearerAuth: [] }],

          responses: {
            200: {
              description: "Liste des projets",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Project",
                    },
                  },
                },
              },
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
          },
        },
      },

      "/projects/{id}": {
        get: {
          summary: "Récupérer un projet spécifique",
          description: "Récupère un projet grâce à son identifiant.",
          tags: ["Projects"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Projet récupéré avec succès",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Project",
                  },
                },
              },
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Accès interdit au projet",
            },
            404: {
              description: "Projet introuvable",
            },
          },
        },

        put: {
          summary: "Mettre à jour un projet",
          description: "Met à jour les informations d'un projet.",
          tags: ["Projects"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      example: "Projet mis à jour",
                    },
                    description: {
                      type: "string",
                      example: "Nouvelle description",
                    },
                  },
                },
              },
            },
          },

          responses: {
            200: {
              description: "Projet mis à jour avec succès",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Project",
                  },
                },
              },
            },
            400: {
              description: "Données invalides",
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Droits insuffisants",
            },
            404: {
              description: "Projet introuvable",
            },
          },
        },

        delete: {
          summary: "Supprimer un projet",
          description: "Supprime un projet.",
          tags: ["Projects"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Projet supprimé avec succès",
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Seul le propriétaire peut supprimer le projet",
            },
            404: {
              description: "Projet introuvable",
            },
          },
        },
      },

      // ============================================================
      // CONTRIBUTORS
      // ============================================================

      "/projects/{id}/contributors": {
        post: {
          summary: "Ajouter un contributeur à un projet",
          description: "Ajoute un utilisateur comme membre du projet.",
          tags: ["Projects"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      example: "utilisateur@example.com",
                    },
                    role: {
                      type: "string",
                      enum: ["ADMIN", "CONTRIBUTOR"],
                      example: "CONTRIBUTOR",
                    },
                  },
                },
              },
            },
          },

          responses: {
            200: {
              description: "Contributeur ajouté avec succès",
            },
            201: {
              description: "Contributeur ajouté avec succès",
            },
            400: {
              description: "Données invalides",
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Droits insuffisants",
            },
            404: {
              description: "Projet ou utilisateur introuvable",
            },
          },
        },
      },

      "/projects/{id}/contributors/{userId}": {
        delete: {
          summary: "Retirer un contributeur d'un projet",
          description: "Retire un utilisateur du projet.",
          tags: ["Projects"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
            {
              name: "userId",
              in: "path",
              required: true,
              description: "ID de l'utilisateur à retirer",
              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Contributeur retiré avec succès",
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Droits insuffisants",
            },
            404: {
              description: "Projet ou utilisateur introuvable",
            },
          },
        },
      },

      // ============================================================
      // TASKS
      // ============================================================

      "/projects/{id}/tasks": {
        post: {
          summary: "Créer une tâche",
          description: "Crée une nouvelle tâche dans un projet.",
          tags: ["Tasks"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title"],
                  properties: {
                    title: {
                      type: "string",
                      example: "Corriger le bug de connexion",
                    },
                    description: {
                      type: "string",
                      example: "Corriger le problème d'authentification",
                    },
                    priority: {
                      type: "string",
                      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
                      example: "MEDIUM",
                    },
                    dueDate: {
                      type: "string",
                      format: "date-time",
                      example: "2026-10-01T18:00:00.000Z",
                    },
                      assigneeIds: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },

          responses: {
            201: {
              description: "Tâche créée avec succès",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Task",
                  },
                },
              },
            },
            400: {
              description: "Données invalides",
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Accès interdit au projet",
            },
            404: {
              description: "Projet introuvable",
            },
          },
        },

        get: {
          summary: "Récupérer toutes les tâches d'un projet",
          description: "Récupère toutes les tâches associées à un projet.",
          tags: ["Tasks"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Liste des tâches",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Task",
                    },
                  },
                },
              },
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Accès interdit au projet",
            },
            404: {
              description: "Projet introuvable",
            },
          },
        },
      },

      "/projects/{id}/tasks/{taskId}": {
        get: {
          summary: "Récupérer une tâche spécifique",
          description: "Récupère une tâche grâce à son identifiant.",
          tags: ["Tasks"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
            {
              name: "taskId",
              in: "path",
              required: true,
              description: "ID de la tâche",
              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Tâche récupérée avec succès",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Task",
                  },
                },
              },
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Accès interdit",
            },
            404: {
              description: "Tâche introuvable",
            },
          },
        },

        put: {
          summary: "Mettre à jour une tâche",
          description: "Met à jour les informations d'une tâche.",
          tags: ["Tasks"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
            {
              name: "taskId",
              in: "path",
              required: true,
              description: "ID de la tâche",
              schema: {
                type: "string",
              },
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      example: "Nouvelle tâche",
                    },
                    description: {
                      type: "string",
                      example: "Description mise à jour",
                    },
                    status: {
                      type: "string",
                      enum: [
                        "TODO",
                        "IN_PROGRESS",
                        "DONE",
                        "CANCELLED",
                      ],
                      example: "IN_PROGRESS",
                    },
                    priority: {
                      type: "string",
                      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
                      example: "HIGH",
                    },
                    dueDate: {
                      type: "string",
                      format: "date-time",
                      example: "2026-10-15T18:00:00.000Z",
                    },
                  },
                },
              },
            },
          },

          responses: {
            200: {
              description: "Tâche mise à jour avec succès",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Task",
                  },
                },
              },
            },
            400: {
              description: "Données invalides",
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Accès interdit",
            },
            404: {
              description: "Tâche introuvable",
            },
          },
        },

        delete: {
          summary: "Supprimer une tâche",
          description: "Supprime une tâche d'un projet.",
          tags: ["Tasks"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
            {
              name: "taskId",
              in: "path",
              required: true,
              description: "ID de la tâche",
              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Tâche supprimée avec succès",
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Accès interdit",
            },
            404: {
              description: "Tâche introuvable",
            },
          },
        },
      },

      // ============================================================
      // COMMENTS
      // ============================================================

      "/projects/{id}/tasks/{taskId}/comments": {
        post: {
          summary: "Créer un commentaire",
          description: "Ajoute un commentaire à une tâche.",
          tags: ["Comments"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
            {
              name: "taskId",
              in: "path",
              required: true,
              description: "ID de la tâche",
              schema: {
                type: "string",
              },
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["content"],
                  properties: {
                    content: {
                      type: "string",
                      example: "Je viens de terminer cette tâche.",
                    },
                  },
                },
              },
            },
          },

          responses: {
            201: {
              description: "Commentaire créé avec succès",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Comment",
                  },
                },
              },
            },
            400: {
              description: "Données invalides",
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Accès interdit",
            },
            404: {
              description: "Projet ou tâche introuvable",
            },
          },
        },

        get: {
          summary: "Récupérer les commentaires d'une tâche",
          description: "Récupère tous les commentaires associés à une tâche.",
          tags: ["Comments"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
            {
              name: "taskId",
              in: "path",
              required: true,
              description: "ID de la tâche",
              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Liste des commentaires",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Comment",
                    },
                  },
                },
              },
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Accès interdit",
            },
            404: {
              description: "Tâche introuvable",
            },
          },
        },
      },

      "/projects/{id}/tasks/{taskId}/comments/{commentId}": {
        get: {
          summary: "Récupérer un commentaire",
          description: "Récupère un commentaire spécifique.",
          tags: ["Comments"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
            {
              name: "taskId",
              in: "path",
              required: true,
              description: "ID de la tâche",
              schema: {
                type: "string",
              },
            },
            {
              name: "commentId",
              in: "path",
              required: true,
              description: "ID du commentaire",
              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Commentaire récupéré avec succès",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Comment",
                  },
                },
              },
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Accès interdit",
            },
            404: {
              description: "Commentaire introuvable",
            },
          },
        },

        put: {
          summary: "Modifier un commentaire",
          description: "Modifie le contenu d'un commentaire.",
          tags: ["Comments"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
            {
              name: "taskId",
              in: "path",
              required: true,
              description: "ID de la tâche",
              schema: {
                type: "string",
              },
            },
            {
              name: "commentId",
              in: "path",
              required: true,
              description: "ID du commentaire",
              schema: {
                type: "string",
              },
            },
          ],

          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["content"],
                  properties: {
                    content: {
                      type: "string",
                      example: "Commentaire modifié.",
                    },
                  },
                },
              },
            },
          },

          responses: {
            200: {
              description: "Commentaire modifié avec succès",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Comment",
                  },
                },
              },
            },
            400: {
              description: "Données invalides",
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Modification interdite",
            },
            404: {
              description: "Commentaire introuvable",
            },
          },
        },

        delete: {
          summary: "Supprimer un commentaire",
          description: "Supprime un commentaire.",
          tags: ["Comments"],
          security: [{ bearerAuth: [] }],

          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID du projet",
              schema: {
                type: "string",
              },
            },
            {
              name: "taskId",
              in: "path",
              required: true,
              description: "ID de la tâche",
              schema: {
                type: "string",
              },
            },
            {
              name: "commentId",
              in: "path",
              required: true,
              description: "ID du commentaire",
              schema: {
                type: "string",
              },
            },
          ],

          responses: {
            200: {
              description: "Commentaire supprimé avec succès",
            },
            401: {
              description: "Token JWT manquant ou invalide",
            },
            403: {
              description: "Suppression interdite",
            },
            404: {
              description: "Commentaire introuvable",
            },
          },
        },
      },
    },
  },

  apis: [
    "./src/routes/*.ts",
    "./src/controllers/*.ts",
    "./src/index.ts",
  ],
};

export const specs = swaggerJsdoc(options);
