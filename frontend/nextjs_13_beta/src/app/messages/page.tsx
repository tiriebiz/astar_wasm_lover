'use client'

import { useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'

import { ApiPromise, WsProvider } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { BN } from "@polkadot/util";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

import styles from './page.module.scss';
import contractAbi from "../astar_wasm_lover.json";
import { MyContext } from '../components/mycontext';

const inter = Inter({ subsets: ['latin'] })

// Const
const blockchainUrl = String(process.env.NEXT_PUBLIC_BLOCK_CHAIN_URL) ?? "";
const contractAddress = String(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) ?? "";

// Metadata
export interface LoverInfo {
  id: string;
  name: string;
  message: string;
  address: string;
  githubUrl: string;
}

export default function Page() {
  const router = useRouter();
  const mycontext = useContext(MyContext);
  if (!mycontext.actingAddress) {
    router.push("/");
    return null;
  }

  const [api, setApi] = useState<any>();
  const [articles, setArticles] = useState<Array<LoverInfo>>([]);

  const setUp = async () => {
    const wsProvider = new WsProvider(blockchainUrl);
    const api = await ApiPromise.create({ provider: wsProvider });
    setApi(api);
  };

  const getGasLimitForNotDeploy = (api: any): any => {
    const gasLimit: any = api.registry.createType("WeightV2", {
      refTime: new BN("100000000000"),
      proofSize: new BN("100000000000"),
    });
    return gasLimit;
  };

  useEffect(() => {
    console.log("mycontext", mycontext);
    console.log("contractAbi", contractAbi);
    console.log("api", api);
    console.log("articles", articles);
    if (!api) {
      setUp();
    }
  });

  const getArticles = async () => {
    console.log("pass getArticles #1", blockchainUrl + ":" + contractAddress);

    const list: LoverInfo[] = [];

    // test data
    list.push({
      id: 9990,
      name: "test data 9990",
      message: "This is a message.",
      githubUrl: "https://github.com",
      address: "[0x9990address]",
    });
    list.push({
      id: 9991,
      name: "test data 999",
      message: "This is a message. This is a message.",
      githubUrl: "https://github.com",
      address: "[0x9991address]",
    });
    list.push({
      id: 9992,
      name: "test data 9992",
      message: "This is a message. This is a message. This is a message.",
      githubUrl: "https://github.com",
      address: "[0x9992address]",
    });
    list.splice(0);

    const contract = new ContractPromise(api, contractAbi, contractAddress);
    const gasLimit: any = getGasLimitForNotDeploy(api);

    const { gasConsumed, result, output } = await contract.query.getMessageList(
      mycontext.actingAddress,
      {
        value: 0,
        gasLimit: gasLimit,
      }
    );
    console.log("pass getArticles #2");
    if (output !== undefined && output !== null) {
      let result = JSON.parse(JSON.stringify(output.toJSON()));
      console.log("result:", result);
      for (let i = 0; i < result.ok.length; i++) {
        list.push({
          id: result.ok[i].id,
          name: result.ok[i].name,
          message: result.ok[i].message,
          githubUrl: result.ok[i].githubUrlOfDapp,
          address: result.ok[i].accountId,
        });
      }
      setArticles(list);
    }
  };

  if (articles.length == 0) {
    // Error: Your API has not been initialized correctly and is not connected to a chain
    // タイミングでこのエラーが出てしまう、、、
    getArticles();
  }

  return (
<>
  <main className={"main-container " + styles.main}>
    <nav>
      <Link className={"btn " + styles.back_to_top} href="/">
        <span><span className="pc-only">Back to </span>Top</span>
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
          <span>#{a.id}</span>
        </div>
        <div className={styles.article_content}>
          <span className={styles.article_name}>{a.name}</span>
          <span className={styles.article_message}>{a.message}</span>
          <Link href="https://github.com" className={styles.article_url_for_dapp}>{a.githubUrl}</Link>
        </div>
      </article>
      )}
    </section>
  </main>
</>
  )
}
