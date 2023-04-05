'use client'

import { useContext, useEffect, useState } from 'react';
import nl2br from 'react-nl2br';

//import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'

import { ContractPromise } from "@polkadot/api-contract";
import { BN } from "@polkadot/util";

import styles from './page.module.scss';
import contractAbi from "../astar_wasm_lover.json";
import { MyContext } from '../components/mycontext';
import { LoverInfo } from '../components/loverinfo';

const inter = Inter({ subsets: ['latin'] })

const contractAddress = String(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) ?? "";

export default function Page() {
  const [articles, setArticles] = useState<Array<LoverInfo>>([]);
  useEffect(() => {
    console.log("mycontext", mycontext);
    console.log("contractAbi", contractAbi);
    console.log("articles", articles);
  });


  // check acting address
  //const router = useRouter();
  const mycontext = useContext(MyContext);
  if (!mycontext.actingAccount) {
    //router.push("/");
    //alert("Acting Account does not exist.");
    return null;
  }
  const buildArticles = async () => {
    const getGasLimitForNotDeploy = (api: any): any => {
      const gasLimit: any = api.registry.createType("WeightV2", {
        refTime: new BN("100000000000"),
        proofSize: new BN("100000000000"),
      });
      return gasLimit;
    };

    console.log("pass buildArticles #1");
    const contract = new ContractPromise(mycontext.api, contractAbi, contractAddress);
    const gasLimit: any = getGasLimitForNotDeploy(mycontext.api);
    const { gasConsumed, result, output } = await contract.query.getMessageList(
      mycontext.actingAccount.address,
      {
        value: 0,
        gasLimit: gasLimit,
      }
    );

    console.log("pass buildArticles #2");
    if (output !== undefined && output !== null) {
      const result = JSON.parse(JSON.stringify(output.toJSON()));
      console.log("result:", result);
      const list: LoverInfo[] = [];
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
  const clearArticles = () => {
    setArticles([]);
  };

  if (articles.length == 0) {
    buildArticles();
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
      <button type="button" onClick={clearArticles} className={"btn " + styles.btn_right}>
        <span>Get Latest</span>
      </button>
      {articles.map((a) => 
      <article key={a.id}>
        <div className={styles.article_header}>
          <span>#{a.id}</span>
        </div>
        <div className={styles.article_content}>
          <span className={styles.article_name}>{a.name}</span>
          <span className={styles.article_message}>{nl2br(a.message)}</span>
          <Link href="https://github.com" className={styles.article_url_for_dapp}>{a.githubUrl}</Link>
        </div>
      </article>
      )}
    </section>
  </main>
</>
  )
}
