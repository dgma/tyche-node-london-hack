import { parseUnits } from "viem";

import { apininjasKey, coinmarketcapKey } from "./env";

type PriceSource = "CoinMarketCap" | "ApiNinjas";
export interface PriceInfo {
  price: bigint;
  source: PriceSource;
}

const INTERVAL_MS = 10000;

let price: bigint | null = null;
let priceSource: PriceSource | null = null;

const PRICE_SOURCES: Record<PriceSource, (abortController: AbortController) => Promise<void>> = {
  CoinMarketCap: fetchCoinMarketCaprice,
  ApiNinjas: fetchApiNinjasPrice,
};
const PRICE_SOURCES_KEYS = Object.keys(PRICE_SOURCES) as PriceSource[];

export const getPriceInfo = async () => {
  if (!price) {
    let abortController: AbortController | null = new AbortController();
    await fetchPriceFromRandomSource(abortController);
    setInterval(async () => {
      abortController?.abort();
      try {
        abortController = new AbortController();
        await fetchPriceFromRandomSource(abortController);
      } catch (error) {
        if (isAbortError(error)) {
          console.info("aborted");
          // Ignore abort errors
        } else {
          throw error;
        }
      } finally {
        abortController = null;
      }
    }, INTERVAL_MS);
  }
  return { price: price ?? 0n, source: priceSource ?? "ApiNinjas" };
};

async function fetchPriceFromRandomSource(abortController: AbortController) {
  const randomIndex = Math.floor(Math.random() * 10) % PRICE_SOURCES_KEYS.length;
  const strategyName = PRICE_SOURCES_KEYS[randomIndex];
  await PRICE_SOURCES[strategyName](abortController);
}

async function fetchCoinMarketCaprice(abortController: AbortController) {
  const res = await fetch("https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug=ethereum", {
    headers: {
      "X-CMC_PRO_API_KEY": coinmarketcapKey as string,
    },
    signal: abortController.signal,
  });

  if (res.ok) {
    const responsePayload = await res.json();
    const value = responsePayload.data["1027"].quote["USD"].price as number;
    price = parseUnits(value.toString(), 8);
    priceSource = "CoinMarketCap";
  }
}

async function fetchApiNinjasPrice(abortController: AbortController) {
  const res = await fetch("https://api.api-ninjas.com/v1/cryptoprice?symbol=ETHUSDT", {
    headers: {
      "X-Api-Key": apininjasKey as string,
    },
    signal: abortController.signal,
  });

  if (res.ok) {
    const responsePayload = await res.json();
    const value = responsePayload.price as number;
    price = parseUnits(value.toString(), 8);
    priceSource = "ApiNinjas";
  }
}

function isAbortError(error: any): error is Error {
  if (error && error.name === "AbortError") {
    return true;
  }
  return false;
}
