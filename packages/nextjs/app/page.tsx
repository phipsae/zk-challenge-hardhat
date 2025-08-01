"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MerkleTreeVisualization from "./_components/MerkleTreeVisualization";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldEventHistory, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [leafEventsArray, setLeafEventsArray] = useState<any[]>([]);

  const { data: leafEvents } = useScaffoldEventHistory({
    contractName: "IncrementalMerkleTree",
    eventName: "NewLeaf",
    fromBlock: 0n,
    watch: true,
    enabled: true,
  });

  const { data: depth } = useScaffoldReadContract({
    contractName: "IncrementalMerkleTree",
    functionName: "getDepth",
  });

  // Update the array whenever new events are emitted
  useEffect(() => {
    if (leafEvents && leafEvents.length > 0) {
      setLeafEventsArray([...leafEvents]);
    }
  }, [leafEvents]);

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <button
            onClick={() => {
              console.log("Current leaf events array:", leafEventsArray);
            }}
          >
            Show Events ({leafEventsArray.length})
          </button>

          {/* Merkle Tree Visualization */}
          <MerkleTreeVisualization leafEvents={leafEventsArray} depth={depth} />

          {leafEventsArray.length > 0 && (
            <div className="mt-4 p-4 bg-base-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Leaf Events Details:</h3>
              {leafEventsArray.map((event, index) => (
                <div key={event.logIndex || index} className="mb-2 p-2 bg-base-100 rounded">
                  <p>
                    <strong>Index:</strong> {index}
                  </p>
                  <p>
                    <strong>Block:</strong> {event.blockNumber?.toString()}
                  </p>
                  <p>
                    <strong>Tx Hash:</strong> {event.transactionHash}
                  </p>
                  {event.args &&
                    Object.keys(event.args).map(key => (
                      <p key={key}>
                        <strong>{key}:</strong> {String(event.args[key])}
                      </p>
                    ))}
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
