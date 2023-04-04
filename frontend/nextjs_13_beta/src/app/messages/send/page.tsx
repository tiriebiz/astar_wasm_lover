'use client'

import { useContext, useEffect, useState} from 'react';

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'

import { ApiPromise, WsProvider } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import { BN } from "@polkadot/util";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

import styles from '../page.module.scss'
import contractAbi from "../../astar_wasm_lover.json";
import { MyContext } from '../../components/mycontext';

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
  const [canSubmit, setCanSubmit] = useState(false);

  const setUp = async () => {
    const wsProvider = new WsProvider(blockchainUrl);
    const api = await ApiPromise.create({ provider: wsProvider });
    setApi(api);
  };

  useEffect(() => {
    console.log("mycontext", mycontext);
    console.log("contractAbi", contractAbi);
    console.log("api", api);
    if (!api) {
      setUp();
    }
  });

  const [addLoverInfo, setAddLoverInfo] = useState<LoverInfo>({
    id: "",
    name: "",
    message: "",
    address: "",
    githubUrl: "",
  });

  const storageDepositLimit = null;
  const getGasLimitForNotDeploy = (api: any): any => {
    const gasLimit: any = api.registry.createType("WeightV2", {
      refTime: new BN("100000000000"),
      proofSize: new BN("100000000000"),
    });
    return gasLimit;
  };

  const sendMessage = async (e) => {
    console.log("## _onSubmit 1", e);

    const validate_input = () => {
      console.log("validate input", addLoverInfo);
      return false;
    };

    const { web3FromSource } = await import("@polkadot/extension-dapp");
    const contract = new ContractPromise(api, contractAbi, contractAddress);
    let actingAccount = null;
    mycontext.accounts.forEach((a) => {
      if (a.address == mycontext.actingAddress) {
        actingAccount = a;
      }
    });
    console.log("actingAccount", actingAccount);

    const injector = await web3FromSource(actingAccount.meta.source);
    const gasLimit: any = getGasLimitForNotDeploy(api);

    const { gasRequired, gasConsumed, result, output } =
      await contract.query.setMessage(
        mycontext.actingAddress,
        { value: 0, gasLimit: gasLimit, storageDepositLimit },
        addLoverInfo.name,
        addLoverInfo.message,
        addLoverInfo.githubUrl,
        0,
        0
      );

    console.log("output?.toHuman()?", output?.toHuman());

    if (output?.toHuman()?.Ok.Err == "AlreadyExists") {
      alert("Your message is already submited.");
      return;
    }

    const setMessage = await contract.tx.setMessage(
      { value: 0, gasLimit: gasRequired },
      addLoverInfo.name,
      addLoverInfo.message,
      addLoverInfo.githubUrl,
      0,
      0
    );

    if (injector !== undefined) {
      const unsub = await setMessage.signAndSend(
        mycontext.actingAddress,
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

  const onChange = (e) => {
    console.log(e.target.name, e.target.value);
    setAddLoverInfo({
      ...addLoverInfo, 
      [e.target.name]: e.target.value,
    });
    if (addLoverInfo.name != "" &&
        addLoverInfo.message != "") {
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
          <input type="text" name="name" id="your_name" onChange={onChange} />
        </div>
        <div className={styles.form_group}>
          <label for="message">Message For Wasm Launch:</label>
          <textarea type="text" name="message" id="message" onChange={onChange}></textarea>
        </div>
        <div className={styles.form_group}>
          <label for="url_of_your_dapp">The Github URL of your dAapp:</label>
          <input type="text" name="githubUrl" id="githubUrl" onChange={onChange} />
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
