'use client'
import { useContext } from 'react';

import styles from './dappenv.module.scss';
import { MyContext } from './mycontext';

export default function DappEnv() {
  const mycontext = useContext(MyContext);
  if (mycontext.blockchainUrl == 'wss://rpc.astar.network') {
    return (
      <></>
    );
  }
  return (
<>
  <div className={styles.dappenv_dev}>Development Mode</div>
</>
  );
}
