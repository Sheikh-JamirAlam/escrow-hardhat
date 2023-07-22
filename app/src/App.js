import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Escrow from "./components/Escrow";
import AbiEscrow from "./artifacts/contracts/Escrow.sol/Escrow";
import AbiHistory from "./artifacts/contracts/History.sol/History";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer, id) {
  const approveTxn = await escrowContract.connect(signer).approve(id);
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [tab, setTab] = useState(escrows.length === 0 ? "New" : "Existing");

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  useEffect(() => {
    if (tab === "Existing") getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function getHistory() {
    if (signer) {
      const historyAddress = "0xEAb7298d16ffe9A4976f7d95E4834e21633cf870";
      const historyContract = new ethers.Contract(historyAddress, AbiHistory.abi, signer);
      const escrowHistory = await historyContract.viewEscrow(account);

      const escrow = escrowHistory
        .map((item) => [item.id, item.contractAddress, item.arbiter, item.beneficiary, ethers.utils.formatEther(item.value.toString()), item.status])
        .map(([id, address, arbiter, beneficiary, value, status]) => ({ id, address, arbiter, beneficiary, value, status }))
        .map((item) => ({
          ...item,
          handleApprove: async () => {
            const escrowContract = new ethers.Contract(item.address, AbiEscrow.abi, signer);
            escrowContract.on("Approved", () => {
              document.getElementById(escrowContract.address).className = "complete";
              document.getElementById(escrowContract.address).innerText = "✓ It's been approved!";
              document.getElementById(escrowContract.address).style.pointerEvents = "none";
            });
            await approve(escrowContract, signer, Number(item.id));
          },
        }));
      setEscrows(escrow);
    }
  }

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;
    const value = ethers.utils.parseEther(document.getElementById("wei").value);
    const historyAddress = "0xEAb7298d16ffe9A4976f7d95E4834e21633cf870";

    const factory = new ethers.ContractFactory(AbiEscrow.abi, AbiEscrow.bytecode, signer);
    const escrowContract = await factory.deploy(arbiter, beneficiary, historyAddress, { value });
    await escrowContract.deployed();
    console.log("Escrow Contract deployed to:", escrowContract.address);

    setTab("Existing");
  }

  return (
    <>
      <header>
        <h2 className="heading">ESCROW SECURE</h2>
        <div className="tabs">
          <span
            className="tabs-name"
            onClick={(e) => {
              e.preventDefault();
              setTab("New");
            }}
          >
            Create
          </span>
          <span
            className="tabs-name"
            onClick={(e) => {
              e.preventDefault();
              setTab("Existing");
            }}
          >
            View Existing
          </span>
        </div>
      </header>
      <main>
        <div className="contract" style={{ display: tab === "Existing" && "none" }}>
          <h1 className="contract-header">New Contract</h1>
          <label className="contract-label">
            Arbiter Address
            <input type="text" id="arbiter" />
          </label>

          <label className="contract-label">
            Beneficiary Address
            <input type="text" id="beneficiary" />
          </label>

          <label className="contract-label">
            Deposit Amount (in ETH)
            <input type="text" id="wei" />
          </label>

          <div
            className="button"
            id="deploy"
            onClick={(e) => {
              e.preventDefault();

              newContract();
            }}
          >
            Deploy
          </div>
        </div>

        <div className="existing-contracts" style={{ display: tab === "New" && "none" }}>
          <h1 className="contract-header">Existing Contracts</h1>

          <div id="container">
            {escrows.map((escrow) => {
              return <Escrow key={escrow.address} {...escrow} />;
            })}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
