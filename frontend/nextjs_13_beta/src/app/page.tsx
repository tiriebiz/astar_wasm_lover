"use client"

import { useState, useContext, useEffect } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/navigation';

import styles from './page.module.scss'
import { MyContext } from './components/mycontext';

const inter = Inter({ subsets: ['latin'] })

export default function Page() {
  const router = useRouter();
  const mycontext = useContext(MyContext);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    console.log("mycontext", mycontext);
  });

  const setActingAddress = (e) => {
    console.log(e);
    mycontext.actingAddress = e.target.value;
    router.push('/messages/');
  };

  const setup = async () => {
    const { web3Accounts, web3Enable } = await import(
      "@polkadot/extension-dapp"
    );
    const extensions = await web3Enable("Polk4NET");
    if (extensions.length === 0) {
      return;
    }
    const accounts = await web3Accounts();
    mycontext.accounts = accounts;
    console.log("mycontext accounts", mycontext.accounts.length);
    if (mycontext.accounts.length == 1) {
      console.log("mycontext accounts", mycontext.accounts[0]);
      mycontext.actingAddress = accounts[0];
      router.push('/messages/');
    }
    setConnected(true);
  };

  return (
<>
  <main className={"main-container " + styles.main}>
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
    <button className={"btn " + styles.connect_wallet} onClick={setup}>
      <span>Connect Wallet</span>
    </button>
    { mycontext.accounts.length > 0 ? (
    <select onChange={setActingAddress}>
      <option key="no_address" value="">Please select your acting address.</option>
      {mycontext.accounts.map((a) => (
        <option key={a.address} value={a.address}>
          {a.address} [{a.meta.name}]
        </option>
       ))}
    </select>
    ) : (
      <>Not connected.</>
    )}
  </main>
</>
  )
}
