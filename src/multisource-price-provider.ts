import { parseUnits } from "viem";
import { apininjasKey, coinmarketcapKey } from "./env";

type PriceSource = "CoinMarketCap" | "ApiNinjas" | "RandomPriceGenerator";

let price: bigint | null = null;
let priceSource: PriceSource | null = null;

const PRICE_SOURCES: Record<PriceSource, () => Promise<void>> = {
  CoinMarketCap: fetchCoinMarketCaprice,
  ApiNinjas: fetchApiNinjasPrice,
  RandomPriceGenerator: generateRandomPrice,
};
const PRICE_SOURCES_KEYS = Object.keys(PRICE_SOURCES) as PriceSource[];

export const getPriceInfo = async () => {
  if (!price) {
    await fetchPriceFromRandomSource();
  }
  return { price, source: priceSource };
};

async function fetchPriceFromRandomSource() {
  console.log("[price-provider]:", "Updating price ⏳");
  const randomIndex = Math.floor(Math.random() * 10) % PRICE_SOURCES_KEYS.length;
  const strategyName = PRICE_SOURCES_KEYS[randomIndex];
  await PRICE_SOURCES[strategyName]();
  console.log("[price-provider]:", "Price successfully updated 🪙");
}

async function fetchCoinMarketCaprice() {
  const res = await fetch("https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug=ethereum", {
    headers: {
      "X-CMC_PRO_API_KEY": coinmarketcapKey as string,
    },
  });

  if (res.ok) {
    const responsePayload = await res.json();
    const value = responsePayload.data["1027"].quote["USD"].price as number;
    price = parseUnits(value.toString(), 8);
    priceSource = "CoinMarketCap";
  }
}

async function fetchApiNinjasPrice() {
  const res = await fetch("https://api.api-ninjas.com/v1/cryptoprice?symbol=ETHUSDT", {
    headers: {
      "X-Api-Key": apininjasKey as string,
    },
  });

  if (res.ok) {
    const responsePayload = await res.json();
    const value = responsePayload.price as number;
    price = parseUnits(value.toString(), 8);
    priceSource = "ApiNinjas";
  }
}

async function generateRandomPrice() {
  price = parseUnits((Math.random() * 10000).toString(), 8);
  priceSource = "RandomPriceGenerator";
}
