import * as crypto from "crypto";
import { encodeAbiParameters, keccak256, parseAbiParameters, toHex } from "viem";

import { httpPublicClient } from "./clients";
import * as OracleContract from "./contracts/oracle";
import * as multisourcePriceProvider from "./multisource-price-provider";

export const start = () => {
  waitForCommitPhase();
};

const waitForCommitPhase = () => {
  console.log("[commit-reveal]:", "Waiting for COMMIT phase ⏳");

  const intervalId: ReturnType<typeof setInterval> = setInterval(async () => {
    if (await canCommit()) {
      console.log("[commit-reveal]:", "Commiting price...");
      clearInterval(intervalId);
      const priceInfo = await multisourcePriceProvider.getPriceInfo();
      const secret = crypto.randomUUID();
      await commit(priceInfo.price ?? 0n, secret);
      waitForRevealPhase(priceInfo.price ?? 0n, secret);
    }
  }, 10000);
};

const waitForRevealPhase = async (price: bigint, secret: string) => {
  console.log("[commit-reveal]:", "Waiting for REVEAL phase ⏳");

  const intervalId = setInterval(async () => {
    if (await canReveal()) {
      console.log("[commit-reveal]:", "Revealing price...");
      await reveal(price, secret);
      clearInterval(intervalId);
      waitForCommitPhase();
    }
  }, 10000);
};

const canCommit = async (): Promise<boolean> => {
  const response = await httpPublicClient.readContract({
    ...OracleContract,
    functionName: "canCommit",
  });

  return response as boolean;
};

const canReveal = async () => {
  const response = await httpPublicClient.readContract({
    ...OracleContract,
    functionName: "canReveal",
  });

  return response as boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const commit = async (price: bigint, secret: string): Promise<void> => {
  // return oracle.commit(getCommitHash(price, secret));
  console.log("[commit-reveal]:", `Commited price "${price}"" ✅`);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const reveal = (price: bigint, secret: string) => {
  // return oracle.reveal(encodeAbiParameters(parseAbiParameters('uint256 price, bytes32 secret'),
  //     [price, toHex(secret)]));
  console.log("[commit-reveal]:", "Price revealed 🃏");
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCommitHash = (price: bigint, secret: string): string => {
  return keccak256(encodeAbiParameters(parseAbiParameters("uint256 price, bytes32 secret"), [price, toHex(secret)]));
};
