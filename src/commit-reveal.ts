import * as crypto from "crypto";
import chalk from "chalk";
import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";

import { account, httpPublicClient, walletClient } from "./config";
import * as OracleContract from "./contracts/oracle";
import * as multisourcePriceProvider from "./multisource-price-provider";

const INTERVAL_MS = 3000;

const register = async () => {
  log("Register Node..");
  const { request } = await httpPublicClient.simulateContract({
    ...OracleContract,
    account,
    functionName: "register",
  });

  await walletClient.writeContract(request);
  log("Done ✅");
};

export const start = async () => {
  await register();
  return waitForCommitPhase();
};

const waitForCommitPhase = () => {
  log("Waiting for COMMIT phase ⏳");

  const intervalId: ReturnType<typeof setInterval> = setInterval(async () => {
    if (await canCommit()) {
      log("Commiting price...");
      clearInterval(intervalId);
      const priceInfo = await multisourcePriceProvider.getPriceInfo();
      const seed = BigInt(crypto.randomInt(281474976710655));
      await commit(priceInfo.price ?? 0n, seed);
      waitForRevealPhase(priceInfo.price ?? 0n, seed);
    }
  }, INTERVAL_MS);
};

const waitForRevealPhase = async (price: bigint, secret: bigint) => {
  log("Waiting for REVEAL phase ⏳");

  const intervalId = setInterval(async () => {
    if (await canReveal()) {
      log("Revealing price...");
      await reveal(price, secret);
      clearInterval(intervalId);
      waitForCommitPhase();
    }
  }, INTERVAL_MS);
};

const canCommit = async (): Promise<boolean> => {
  const response = await httpPublicClient.readContract({
    ...OracleContract,
    account,
    functionName: "canCommit",
  });

  return response as boolean;
};

const canReveal = async () => {
  const response = await httpPublicClient.readContract({
    ...OracleContract,
    account,
    functionName: "canReveal",
  });

  return response as boolean;
};

const commit = async (price: bigint, secret: bigint): Promise<void> => {
  const { request } = await httpPublicClient.simulateContract({
    ...OracleContract,
    account,
    functionName: "commit",
    args: [getCommitHash(price, secret)],
  });

  await walletClient.writeContract(request);

  log(`Commited price "${price}"" ✅`);
};

const reveal = async (price: bigint, secret: bigint) => {
  const { request } = await httpPublicClient.simulateContract({
    ...OracleContract,
    account,
    functionName: "reveal",
    args: [secret, price],
  });

  await walletClient.writeContract(request);

  log("Price revealed 🃏");
};

const getCommitHash = (price: bigint, secret: bigint): string => {
  const encodedAbiParameters = encodeAbiParameters(parseAbiParameters("uint256 price, uint256 secret"), [
    price,
    secret,
  ]);

  const hash = keccak256(encodedAbiParameters);

  return hash;
};

function log(message: string) {
  console.log(chalk.greenBright("[commit-reveal]:"), message);
}
