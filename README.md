[![Quality gate](https://github.com/dgma/automation-node-starter/actions/workflows/quality-gate.yml/badge.svg)](https://github.com/dgma/automation-node-starter/actions/workflows/quality-gate.yml)

# Decentralized Oracle Node

Implementation of the Oracle node that utilizes commit/reveal mechanism to update the Oracle contract with the current price from random sources.

[NOTE] This implementation is for the demo purposes only.

## Local Development

1. Create a `.env` file with the following environment variables specified

```
COINMARKETCAP_KEY="<api_key_here>"
RPC="https://base-sepolia.g.alchemy.com/v2/ykvfAeCiG45ysR_S_SetqZETLRvy-p-s"
WS_RPC="wss://base-sepolia.g.alchemy.com/v2/ykvfAeCiG45ysR_S_SetqZETLRvy-p-s"
NETWORK="baseSepolia"
APININJAS_KEY="<api_key_here>"
```

2. Create a `.env` file for each node implementation under the `src/oracle-nodes/*` folder the following environment variables specified

```
# src/oracle-nodes/node1

# Node primary key
NODE_PK="<primary_key_here>"
```

3. Now you can run any of the nodes locally. For example

```
npx ts-node src/oracle-nodes/node1
```

Or you can run all of the nodes together with docker-compose

```
docker compose build
docker compose up
```
