import * as commitReveal from "./commit-reveal";
import * as multisourcePriceProvider from "./multisource-price-provider";

async function main() {
  await preHeatPriceProvider();
  commitReveal.start();
}

function preHeatPriceProvider() {
  return multisourcePriceProvider.getPriceInfo();
}

main();
