import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import styles from "./projet.module.css"

export default function CompteLayout({ children }) {
    return (
        <>
            <Navbar />

            <main className={styles.backgroundMain}>
                {children}
            </main>

            <Footer />
        </>
    );
}
