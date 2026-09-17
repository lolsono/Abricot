"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {

    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const initials = user
        ? `${user.lastName?.[0] || ""}${user.firstName?.[0] || ""}`
        : "";

    const isCompteActive = pathname.startsWith("/compte");
    const isProjetActive = pathname.startsWith("/projet");

    // Ferme le menu si on clique en dehors
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
        router.push("/connexion/login");
    };

    return (
        <nav className={styles.navbar}>

            <Link href="/compte">
                <Image
                    src="/Logo.svg"
                    alt="Abricot"
                    className={styles.logoAbricot}
                    width={148}
                    height={19}
                />
            </Link>

            <div className={styles.links}>

                <Link
                    href="/compte"
                    className={isCompteActive ? styles.active : ""}
                >
                    <span className={styles.icon}>
                        <Image
                            src={
                                isCompteActive
                                    ? "/logo_dashboard_white.svg"
                                    : "/logo_dashboard_orange.svg"
                            }
                            alt="logo du tableau de bord"
                            width={24}
                            height={24}
                        />
                    </span>
                    Tableau de bord
                </Link>

                <Link
                    href="/projet"
                    className={isProjetActive ? styles.active : ""}
                >
                    <span className={styles.icon}>
                        <Image
                            src={
                                isProjetActive
                                    ? "/logo_folder_white.svg"
                                    : "/logo_folder_orange.svg"
                            }
                            alt="logo de dossier"
                            width={24}
                            height={24}
                        />
                    </span>
                    Projets
                </Link>
            </div>

            <div className={styles.userWrapper} ref={menuRef}>

                <button
                    className={styles.user}
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-haspopup="true"
                    aria-expanded={menuOpen}
                >
                    {initials}
                </button>

                {menuOpen && (
                    <div className={styles.userMenu}>

                        <Link
                            href="/compte"
                            className={styles.userMenuItem}
                            onClick={() => setMenuOpen(false)}
                        >
                            Voir mon compte
                        </Link>

                        <button
                            className={`${styles.userMenuItem} ${styles.logoutItem}`}
                            onClick={handleLogout}
                        >
                            Se déconnecter
                        </button>

                    </div>
                )}

            </div>

        </nav>
    );
}
