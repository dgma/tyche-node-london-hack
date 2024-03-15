// import { httpPublicClient } from "./clients";
// import { multicall } from "./contracts";
import {getCexPrice} from "./getCexPrice";
import {canCommit, commit} from "./commit";
import {canReveal, reveal} from "./reveal";

async function main() {
  initCommitReveal();
}

function initCommitReveal() {
  setInterval(async() => {
    if(await canCommit()) {
      const price = await getCexPrice();
      const currentSecret = crypto.randomUUID();
      await commit(price, currentSecret);
      setReveal(price, currentSecret);
    }
  }, 60000);
}

function setReveal(price: number, secret: string) {
  let checker = setInterval(async () => {
    if(await canReveal()) {
     await reveal(price, secret);
     clearInterval(checker);
    }
  }, 60000)
}

main();
