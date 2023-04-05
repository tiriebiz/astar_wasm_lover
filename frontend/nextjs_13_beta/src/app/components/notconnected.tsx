'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'

import styles from './notconnected.module.scss';

const inter = Inter({ subsets: ['latin'] })

export default function NotConnected() {
  return (
<>
  <main className={"main-container " + styles.main}>
    <nav>
      <span></span>
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
      <span></span>
    </nav>
    <section className={styles.not_connected}>
      <p>Your wallet is not connected.</p>
      <Link className={"btn " + styles.back_to_top} href="/">
        <span>Back to Top</span>
      </Link>
    </section>
  </main>
</>
  );
}
