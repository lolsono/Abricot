import Image from "next/image";
import styles from "./page.module.css";
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.page}>

      <p>test bp</p>
       <Link href="/connexion/login">Blog</Link>
       
    </div>
  );
}
