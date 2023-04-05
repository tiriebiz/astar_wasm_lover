"use client"

import { useState, useContext, useEffect } from 'react';

import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/navigation';

import { ApiPromise, WsProvider } from "@polkadot/api";

import styles from './page.module.scss'
import { MyContext } from './components/mycontext';

const inter = Inter({ subsets: ['latin'] })

// Const
const blockchainUrl = String(process.env.NEXT_PUBLIC_BLOCK_CHAIN_URL) ?? "";

export default function Page() {
  const router = useRouter();
  const mycontext = useContext(MyContext);

  // setUp実行完了後に、useEffectを実行して再度レンダリングしてほしい。
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    console.log("mycontext", mycontext);
  });

  // ActingAccountのセットするだけ
  const setActingAccount = (e) => {
    console.log(e);
    mycontext.accounts.forEach((a) => {
      if (a.address == e.target.value) {
        mycontext.actingAccount = a;
      }
    });
    router.push('/messages/');
  };

  // Wallet接続して、APIコールの準備をしておいた方が良さそう。
  const connectWallet = async () => {
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
      mycontext.actingAccount = accounts[0];
      router.push('/messages/');
    }

    // API準備
    console.log("set api");
    const wsProvider = new WsProvider(blockchainUrl);
    const api = await ApiPromise.create({ provider: wsProvider });
    mycontext.api = api;

    // アカウントが複数ある場合は、再度レンダリングしてほしいので、stateを変更。
    setConnected(true);
  };

  // DappEnvの初期表示
  if (!mycontext.blockchainUrl) {
    mycontext.blockchainUrl = blockchainUrl;
    setConnected(false);
  }

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
    <button className={"btn " + styles.connect_wallet} onClick={connectWallet}>
      <span>Connect Wallet</span>
    </button>
    { mycontext.accounts.length > 0 ? (
    <select onChange={setActingAccount}>
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
