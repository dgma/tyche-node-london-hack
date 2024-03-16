import * as crypto from "crypto";
import chalk from "chalk";
import { encodeAbiParameters, keccak256, parseAbiParameters, toHex } from "viem";

import { account, httpPublicClient, walletClient } from "./config";
import * as OracleContract from "./contracts/oracle";
import * as multisourcePriceProvider from "./multisource-price-provider";

export const start = () => {
  waitForCommitPhase();
};

const waitForCommitPhase = () => {
  log("Waiting for COMMIT phase ⏳");

  const intervalId: ReturnType<typeof setInterval> = setInterval(async () => {
    if (await canCommit()) {
      log("Commiting price...");
      clearInterval(intervalId);
      const priceInfo = await multisourcePriceProvider.getPriceInfo();
      const seed = crypto.randomUUID();
      await commit(priceInfo.price ?? 0n, seed);
      waitForRevealPhase(priceInfo.price ?? 0n, seed);
    }
  }, 10000);
};

const waitForRevealPhase = async (price: bigint, secret: string) => {
  log("Waiting for REVEAL phase ⏳");

  const intervalId = setInterval(async () => {
    if (await canReveal()) {
      log("Revealing price...");
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

const commit = async (price: bigint, secret: string): Promise<void> => {
  const { request } = await httpPublicClient.simulateContract({
    ...OracleContract,
    account,
    functionName: "commit",
    args: [getCommitHash(price, secret)],
  });

  await walletClient.writeContract(request);

  log(`Commited price "${price}"" ✅`);
};

const reveal = async (price: bigint, secret: string) => {
  const { request } = await httpPublicClient.simulateContract({
    ...OracleContract,
    account,
    functionName: "reveal",
    args: [price, secret],
  });

  await walletClient.writeContract(request);

  log("Price revealed 🃏");
};

const getCommitHash = (price: bigint, secret: string): string => {
  return keccak256(encodeAbiParameters(parseAbiParameters("uint256 price, bytes32 secret"), [price, toHex(secret)]));
};

function log(message: string) {
  console.log(chalk.greenBright("[commit-reveal]:"), message);
}
