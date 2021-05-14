import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Home() {
  const { accessToken } = useSelector((state) => {
    return {
      accessToken: state.accessToken,
    };
  });
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a>NanoURL</a>!
        </h1>
        {!accessToken && (
          <p className={styles.description}>
          <Link href="/login">
              <a>Click here to login~</a>
            </Link>
          </p>
        )}
        {accessToken && (
          <p className={styles.description}>
          <Link href="/account">
              <a>Click here to go to account page~</a>
            </Link>
          </p>
        )}
      </main>
    </div>
  );
}
