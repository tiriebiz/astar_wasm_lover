import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import styles from './page.module.scss'

const inter = Inter({ subsets: ['latin'] })

export default function Page() {
  return (
<>
  <main className={styles.main}>
    <h1 className={styles.main_copy}>
      For All Wasm Contract Lovers
    </h1>
    <Image
      className={styles.astar_logo}
      alt=""
      src="/assets/common/img/Astar_landscape.png"
      width="500"
      height="334"
    />
    <Link className={styles.connect_wallet} href="/top/">
      <span>Connect Wallet</span>
    </Link>
  </main>
</>
  )
}
