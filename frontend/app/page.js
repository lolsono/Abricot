"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

export default function Home() {

  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>

      <p>test bp</p>

      {isAuthenticated ? (
        <div>
          <h1>Bienvenue {user.name} 👋</h1>

          <p>
            <strong>ID :</strong> {user.id}
          </p>

          <p>
            <strong>Email :</strong> {user.email}
          </p>

          <p>
            <strong>Nom :</strong> {user.name}
          </p>

          <p>
            <strong>Compte créé le :</strong>{" "}
            {user.createdAt}
          </p>

          <p>
            <strong>Dernière modification :</strong>{" "}
            {user.updatedAt}
          </p>
        </div>
      ) : (
        <div>
          <p>Vous n'êtes pas connecté.</p>

          <Link href="/connexion/login">
            Se connecter
          </Link>
        </div>
      )}

    </div>
  );
}
