import { createPublicClient, http } from "viem";

import { baseSepolia } from "viem/chains";

import { rpc } from "./env";

export const httpPublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(rpc),
});
