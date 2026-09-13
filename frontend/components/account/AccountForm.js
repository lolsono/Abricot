"use client";

import { useAuth } from "@/context/AuthContext";
import styles from "./AccountForm.module.css";

export default function AccountForm() {

    const { user, loading } = useAuth();

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (!user) {
        return <p>Utilisateur non connecté.</p>;
    }

    return (
        <section className={styles.container}>

            <div className={styles.header}>
                <h1>Mon compte</h1>

                <p>{user.firstName} {user.lastName}</p>
            </div>

            <form>

                <div className={styles.inputGroup}>
                    <label htmlFor="lastname">Nom</label>

                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        defaultValue={user.lastName}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="firstname">Prénom</label>

                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        defaultValue={user.firstName}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>

                    <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={user.email}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">
                        Mot de passe
                    </label>

                    <input
                        type="password"
                        id="password"
                        name="password"
                    />
                </div>

                <button
                    type="submit"
                    className={styles.button}
                >
                    Modifier les informations
                </button>

            </form>

        </section>
    );
}
