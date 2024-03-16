// import { httpPublicClient } from "./clients";
// import { multicall } from "./contracts";
import {fetchCexPrice, getCexPrice} from "./getCexPrice";
import {canCommit, commit} from "./commit";
import {canReveal, reveal} from "./reveal"

async function main() {
  initPriceUpdate();
  initCommitReveal();
}

function initPriceUpdate() {
  setInterval(async() => {
    await fetchCexPrice();
  }, 5000)
}

function initCommitReveal() {
  let commitInterval: ReturnType<typeof setInterval> = setInterval(async() => {
    if(await canCommit()) {
      clearInterval(commitInterval)
      const price = await getCexPrice();
      const currentSecret = crypto.randomUUID();
      await commit(price, currentSecret);
      setReveal(price, currentSecret);
    }
  }, 6000);
}

function setReveal(price: bigint, secret: string) {
  let checker = setInterval(async () => {
    if(await canReveal()) {
     await reveal(price, secret);
     clearInterval(checker);
     initCommitReveal();
    }
  }, 6000)
}

main();
