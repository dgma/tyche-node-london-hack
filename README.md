[![Quality gate](https://github.com/dgma/automation-node-starter/actions/workflows/quality-gate.yml/badge.svg)](https://github.com/dgma/automation-node-starter/actions/workflows/quality-gate.yml)

# automation-node-starter

Development starter kit for node.js ts web3 automation nodes

## Features

- Typescript & ts-node
- Jest for unit testing
- linters, code formatter, pre-commit and pre-push hooks
- Docker & Docker-compose example
- Custom github action and quality gate workflow for fast CI strategy implementation

## Requirements

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)  
    -   You'll know you've done it right if you can run `git --version`
- [Node.js](https://nodejs.org/en)
- Optional. [Docker](https://www.docker.com/)
    - You'll need to run docker if you want to use run production container builds locally

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

## Contributing

Contributions are always welcome! Open a PR or an issue!

Please install the following:

And you probably already have `make` installed... but if not [try looking here.](https://askubuntu.com/questions/161104/how-do-i-install-make)