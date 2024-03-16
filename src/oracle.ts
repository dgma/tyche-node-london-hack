// import { fetchCexPrice } from "./getCexPrice";
import * as commitReveal from "./commit-reveal";

async function main() {
  // initPriceUpdate();
  commitReveal.start();
}

// function initPriceUpdate() {
//   setInterval(async () => {
//     await fetchCexPrice();
//   }, 10000);
// }

main();
