import * as dotenv from "dotenv";
const config = dotenv.config({ path: "./.env.local" });

const getEnv = (prop: string) => config?.parsed?.[prop] || process.env[prop];

export const node_pk = getEnv("NODE_PK");
export const rpc = getEnv("RPC");
export const ws_rpc = getEnv("WS_RPC");
export const coinmarketcapKey = getEnv("COINMARKETCAP_KEY");
export const apininjasKey = getEnv("APININJAS_KEY");

if (!node_pk || !rpc || !ws_rpc) {
  throw new Error("Configuration mistake. Check your env file");
}

export default getEnv;
