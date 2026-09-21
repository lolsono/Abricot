"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./ProjectFormModif.module.css";
import UserSelector from "../autocompletion/autocompletion.js";

import { modifProject, addContributor, removeContributor} from "@/services/projectServices";

export default function ProjectFormModif({ project, onSubmit }) {
    const [projectId, setProjectId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [contributors, setContributors] = useState([]);

    // On garde les valeurs originales pour pouvoir comparer
    const [initialId, setInitialId] = useState("");
    const [initialName, setInitialName] = useState("");
    const [initialDescription, setInitialDescription] = useState("");
    const [initialContributors, setInitialContributors] = useState([]);

    const { user, loading } = useAuth();

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (project) {
            const projectName = project.name || "";
            const projectDescription = project.description || "";

            const projectContributors = (project.members || [])
                .map((member) => member.user)
                .filter(Boolean);

            // Valeurs affichées dans le formulaire
            setProjectId(project.id);
            setName(projectName);
            setDescription(projectDescription);
            setContributors(projectContributors);

            // Valeurs originales
            setInitialId(project.id);
            setInitialName(projectName);
            setInitialDescription(projectDescription);
            setInitialContributors(projectContributors);
        }
    }, [project]);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (!user) {
        return <p>Utilisateur non connecté.</p>;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        try {
            /* modif description ou nom */
            const nameChanged = name !== initialName;
            const descriptionChanged = description !== initialDescription;

            if (nameChanged || descriptionChanged) {
                await modifProject(projectId, name, description);
            }

            /* Contributeur ajouté */
            const addedContributors = contributors.filter(
                (contributor) =>
                    !initialContributors.some(
                        (initialContributor) =>
                            initialContributor.id === contributor.id
                    )
            );

            /* Contributeur supprimé */
            const removedContributors = initialContributors.filter(
                (initialContributor) =>
                    !contributors.some(
                        (contributor) =>
                            contributor.id === initialContributor.id
                    )
            );

            for (const contributor of addedContributors) {
                await addContributor(projectId, contributor.email);
            }

            for (const contributor of removedContributors) {
                await removeContributor(projectId, contributor.id);                
            }

            setSuccessMessage("Projet modifié avec succès !");

            if (onSubmit) {
                onSubmit({
                    name,
                    description,
                    contributors,
                });
            }

            // Les nouvelles valeurs deviennent les valeurs de référence
            setInitialName(name);
            setInitialDescription(description);
            setInitialContributors(contributors);

        } catch (error) {
            console.error(error);
            setErrorMessage(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>

            <div className={styles.formGroup}>
                <label htmlFor="title">
                    Titre<span>*</span>
                </label>

                <input
                    id="title"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description">
                    Description<span>*</span>
                </label>

                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <UserSelector
                value={contributors}
                onChange={setContributors}
            />

            {errorMessage && (
                <p className={styles.errorMessage}>
                    {errorMessage}
                </p>
            )}

            {successMessage && (
                <p className={styles.successMessage}>
                    {successMessage}
                </p>
            )}

            <button
                type="submit"
                className={styles.submitButton}
            >
                Enregistrer
            </button>

        </form>
    );
}
