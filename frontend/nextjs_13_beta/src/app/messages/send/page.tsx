'use client'

import { useContext, useEffect, useState} from 'react';

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'

import { ContractPromise } from "@polkadot/api-contract";
import { BN } from "@polkadot/util";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

import styles from '../page.module.scss'
import contractAbi from "../../astar_wasm_lover.json";
import { MyContext } from '../../components/mycontext';
import { LoverInfo } from '../../components/loverinfo';

const inter = Inter({ subsets: ['latin'] })

const contractAddress = String(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) ?? "";

export default function Page() {
  const router = useRouter();
  const mycontext = useContext(MyContext);
  if (!mycontext.actingAccount) {
    router.push("/");
    return null;
  }

  const [canSubmit, setCanSubmit] = useState(false);
  const [formInfo, setFormInfo] = useState<LoverInfo>({
    id: "",
    name: "",
    message: "",
    address: "",
    githubUrl: "",
  });
  useEffect(() => {
    console.log("mycontext", mycontext);
    console.log("contractAbi", contractAbi);
    console.log("canSubmit", canSubmit);
    console.log("formInfo", formInfo);
  });

  const sendMessage = async (e) => {
    console.log("## sendMessage 0");

    const storageDepositLimit = null;
    const getGasLimitForNotDeploy = (api: any): any => {
      const gasLimit: any = api.registry.createType("WeightV2", {
        refTime: new BN("100000000000"),
        proofSize: new BN("100000000000"),
      });
      return gasLimit;
    };

    console.log("## sendMessage 1");
    const { web3FromSource } = await import("@polkadot/extension-dapp");
    const contract = new ContractPromise(mycontext.api, contractAbi, contractAddress);
    const injector = await web3FromSource(mycontext.actingAccount.meta.source);
    const gasLimit: any = getGasLimitForNotDeploy(mycontext.api);
    const { gasRequired, gasConsumed, result, output } =
      await contract.query.setMessage(
        mycontext.actingAccount.address,
        { value: 0, gasLimit: gasLimit, storageDepositLimit },
        formInfo.name,
        formInfo.message,
        formInfo.githubUrl,
        0,
        0
      );

    console.log("output?.toHuman()?", output?.toHuman());
    if (output?.toHuman()?.Ok.Err == "AlreadyExists") {
      alert("Your message is already submited.");
      return;
    }

    console.log("## sendMessage 2");
    const setMessage = await contract.tx.setMessage(
      { value: 0, gasLimit: gasRequired },
      formInfo.name,
      formInfo.message,
      formInfo.githubUrl,
      0,
      0
    );
    if (injector !== undefined) {
      const unsub = await setMessage.signAndSend(
        mycontext.actingAccount.address,
        { signer: injector.signer },
        ({ status, events = [] }) => {
          if (status.isFinalized) {
            events.forEach(({ event: { data } }) => {
              console.log("### data.methhod:", data.method);
              if (String(data.method) == "ExtrinsicFailed") {
                console.log("### check ExtrinsicFailed");
                //setStatusString("Transaction is failure");
              } else{
                //setStatusString("Transaction is success");
              }
            });
            
            unsub();
            //api.disconnect();
          }
        }
      );
    }

    router.push("/messages/");
    return null;
  }

  const changeFormInfo = (e) => {
    setFormInfo({
      ...formInfo, 
      [e.target.name]: e.target.value,
    });
    // 入力チェック
    if (formInfo.name != "" && formInfo.message != "") {
      setCanSubmit(true);
    }
  };
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
          <input type="text" name="name" id="your_name" onChange={changeFormInfo} />
        </div>
        <div className={styles.form_group}>
          <label for="message">Message For Wasm Launch:</label>
          <textarea type="text" name="message" id="message" onChange={changeFormInfo}></textarea>
        </div>
        <div className={styles.form_group}>
          <label for="url_of_your_dapp">The Github URL of your dAapp:</label>
          <input type="text" name="githubUrl" id="githubUrl" onChange={changeFormInfo} />
        </div>
        <button className={"btn " + (canSubmit ? styles.submit_message : styles.disabled_submit_message)} onClick={sendMessage} type="button">
          <span>Submit</span>
        </button>
      </form>
    </section>
  </main>
</>
  )
}
