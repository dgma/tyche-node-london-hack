import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { baseSepolia } from "viem/chains";

import { rpc, node_pk } from "./env";

export const account = privateKeyToAccount(node_pk as `0x${string}`);

export const httpPublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(rpc, { retryCount: 3, retryDelay: 1000 }),
});

export const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(rpc, { retryCount: 3, retryDelay: 1000 }),
});
