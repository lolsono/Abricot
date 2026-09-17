"use client";

import { useState } from "react";
import styles from "./projet.module.css";
import Modal from "@/components/modal/Modal.js";
import ProjectForm from "@/components/projectForm/ProjectForm.js";

export default function Projet() {

    const [modalOpen, setModalOpen] = useState(false);

    const handleCreateProject = (data) => {

        console.log(data);
        // await createProject(...)

        setModalOpen(false);
    };

    return (
        <div className={styles.containerProject}>

            <h2>Mes projets</h2>

            <div className={styles.containerButton}>

                <p>Gérez vos projets</p>

                <button
                    className={styles.createButton}
                    onClick={() => setModalOpen(true)}
                >
                    + Créer un projet
                </button>

            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Créer un projet"
            >
                <ProjectForm
                    onSubmit={handleCreateProject}
                />
            </Modal>

        </div>
    );
}
