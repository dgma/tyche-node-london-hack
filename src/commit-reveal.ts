import * as crypto from "crypto";
import chalk from "chalk";
import { encodeAbiParameters, keccak256, parseAbiParameters } from "viem";

import { account, httpPublicClient, walletClient } from "./config";
import * as OracleContract from "./contracts/oracle";
import * as multisourcePriceProvider from "./multisource-price-provider";
import { type PriceInfo } from "./multisource-price-provider";

const INTERVAL_MS = 3000;

export const start = () => {
  waitForCommitPhase();
};

const waitForCommitPhase = () => {
  log("Waiting for COMMIT phase ⏳");

  const intervalId: ReturnType<typeof setInterval> = setInterval(async () => {
    if (await canCommit()) {
      clearInterval(intervalId);
      const priceInfo = await multisourcePriceProvider.getPriceInfo();
      const seed = BigInt(crypto.randomInt(281474976710655));
      log(`Commiting price "${priceInfo.price}" from "${priceInfo.source}"`);
      await commit(priceInfo.price, seed);
      log(`Commited price ✅`);
      waitForRevealPhase(priceInfo, seed);
    }
  }, INTERVAL_MS);
};

const waitForRevealPhase = async (priceInfo: PriceInfo, secret: bigint) => {
  log("Waiting for REVEAL phase ⏳");

  const intervalId = setInterval(async () => {
    if (await canReveal()) {
      log(`Revealing price "${priceInfo.price}" from "${priceInfo.source}"`);
      await reveal(priceInfo.price, secret);
      log("Price revealed 🃏");
      clearInterval(intervalId);
      waitForCommitPhase();
    }
  }, INTERVAL_MS);
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

const commit = async (price: bigint, secret: bigint): Promise<void> => {
  const { request } = await httpPublicClient.simulateContract({
    ...OracleContract,
    account,
    functionName: "commit",
    args: [getCommitHash(price, secret)],
  });

  await walletClient.writeContract(request);
};

const reveal = async (price: bigint, secret: bigint) => {
  const { request } = await httpPublicClient.simulateContract({
    ...OracleContract,
    account,
    functionName: "reveal",
    args: [secret, price],
  });

  await walletClient.writeContract(request);
};

const getCommitHash = (price: bigint, secret: bigint): string => {
  const encodedAbiParameters = encodeAbiParameters(parseAbiParameters("uint256 price, uint256 secret"), [
    price,
    secret,
  ]);

  const hash = keccak256(encodedAbiParameters);

  return hash;
};

const LOG_LABEL = chalk.greenBright("[commit-reveal]:");

function log(message: string) {
  console.log(LOG_LABEL, message);
}
