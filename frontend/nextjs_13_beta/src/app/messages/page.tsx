import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import styles from './page.module.scss'

const inter = Inter({ subsets: ['latin'] })

export default function Page() {
  const articles = [];
  articles.push({});
  articles.push({});
  articles.push({});
  articles.push({});
  articles.push({});
  articles.push({});
  articles.push({});
  return (
<>
  <main className={"main-container " + styles.main}>
    <nav>
      <Link className={"btn " + styles.back_to_top} href="/">
        <span>Back<span className="pc-only"> to Top</span></span>
      </Link>
      <h2 className={styles.main_copy}>
        For All Wasm Contract Lovers
        <Image
          className={styles.astar_logo}
          alt=""
          src="/assets/common/img/Astar_landscape.png"
          width="167"
          height="111"
        />
      </h2>
      <Link className={"btn " + styles.send_message} href="/messages/send">
        <span>Send<span className="pc-only"> Message</span></span>
      </Link>
    </nav>
    <section className={styles.article_list}>
      {articles.map((a) => 
      <article>
        <div className={styles.article_header}>
          <span>#0000</span>
        </div>
        <div className={styles.article_content}>
          <span className={styles.article_name}>Real Takahashi</span>
          <span className={styles.article_message}>This is a message. This is a message. This is a message. This is a message. This is a message. This is a message. </span>
          <Link href="https://github.com" className={styles.article_url_for_dapp}>https://github.com</Link>
        </div>
      </article>
      )}
    </section>
  </main>
</>
  )
}
