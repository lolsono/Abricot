import Image from "next/image";
import styles from "./singUp.module.css";

export default function SignUp() {
    return (
        <main className={styles.page}>
            <div className={styles.container}>

                {/* Partie gauche */}
                <section className={styles.formSection}>

                    <div className={styles.logo}>
                        <Image
                            src="/Logo.svg"
                            alt="Abricot"
                            width={105}
                            height={40}
                            priority
                        />
                    </div>

                    <div className={styles.formContainer}>

                        <h1>Inscription</h1>

                        <form>

                            <div className={styles.inputGroup}>
                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
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
                                className={styles.loginButton}
                            >
                                S’inscrire
                            </button>

                        </form>

                    </div>

                    <div className={styles.register}>
                        <span>Déjà inscrit ?</span>

                        <a href="/connexion/login">
                            Se connecter
                        </a>
                    </div>

                </section>


                {/* Partie droite */}
                <section className={styles.imageSection}>
                    <Image
                        src="/background_Sign_Up.jpg"
                        alt="Bureau avec ordinateur et fournitures"
                        fill
                        priority
                        className={styles.image}
                    />
                </section>

            </div>
        </main>
    );
}


