import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import styles from '../page.module.scss'

const inter = Inter({ subsets: ['latin'] })

export default function Page() {
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
      <Link className={"btn " + styles.send_message} href="/messages/">
        <span>List<span className="pc-only"> Messages</span></span>
      </Link>
    </nav>
    <section className={styles.send_message_form}>
      <form>
        <div className={styles.form_group}>
          <p>Please submit your message for Wasm Launch.</p>
        </div>
        <div className={styles.form_group}>
          <label for="your_name">Your name:</label>
          <input type="text" name="your_name" id="your_name" />
        </div>
        <div className={styles.form_group}>
          <label for="message">Message For Wasm Launch:</label>
          <textarea type="text" name="message" id="message"></textarea>
        </div>
        <div className={styles.form_group}>
          <label for="url_of_your_dapp">The Github URL of your dAapp:</label>
          <input type="text" name="url_of_your_dapp" id="url_of_your_dapp" />
        </div>
        <a className={"btn " + styles.submit_message} href="/messages/">
          <span>Submit</span>
        </a>
      </form>
    </section>
  </main>
</>
  )
}
