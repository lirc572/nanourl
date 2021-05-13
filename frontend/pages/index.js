import styles from "../styles/Home.module.css";
import Link from "next/link";
import { Button } from "antd";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to {" "}
          <a>
            NanoURL
          </a>
          !
        </h1>

        <p className={styles.description}>
        <Link href="/login">
            <a>Click here to login~</a>
          </Link>
        </p>
      </main>
    </div>
  );
}
