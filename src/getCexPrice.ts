import {apininjasKey, coinmarketcapKey} from "./env";
import { parseUnits} from "viem";

let cexPrice: bigint | null = null;

export const fetchCMPrice = async () => {
  const res = await fetch('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug=ethereum',
    { headers: {
        'X-CMC_PRO_API_KEY': coinmarketcapKey as string,
      }
    })

  if(res.ok) {
    const responsePayload = await res.json();
    return setCMPrice(responsePayload);
  }
}

const setANPrice = (payload: Record<string, any>) => {
  const price = payload.price as number;
  console.log('setting price', price);
  cexPrice = parseUnits(price.toString(), 8);
}
export const fetchANPrice = async () => {
  const res = await fetch('https://api.api-ninjas.com/v1/cryptoprice?symbol=ETHUSDT',
    { headers : {
        'X-Api-Key': apininjasKey as string,
      }})

  if(res.ok) {
    const responsePayload = await res.json();
    return setANPrice(responsePayload);
  }
}

const setCMPrice = (payload: Record<string, any>): void => {
  const price = payload.data['1027'].quote['USD'].price as number;
  console.log('setting price', price);
  cexPrice = parseUnits(price.toString(), 8);
}

const getRandomPrice = async () => {
  cexPrice = parseUnits((Math.random() * 10000).toString(), 8);
};

const STRATEGIES: Record<string, () => Promise<void>> = {
  'COINMARKETCAP': fetchCMPrice,
  'APININJAS': fetchANPrice,
  'RANDOM': getRandomPrice,
}

const getStrategy = (name: string) => {
  console.log(name);
  const strategy = STRATEGIES[name];
  if(!strategy) throw new Error('Invalid strategy');

  return strategy;
}

const strategies = Object.keys(STRATEGIES);
export const fetchCexPrice = async () => {
  const randomIndex = Math.floor(Math.random() * 10) % strategies.length
  const strategyName = strategies[randomIndex]
  await getStrategy(strategyName as string)();
}
export const getCexPrice = async (): Promise<bigint> => {
  if(!cexPrice) await fetchCexPrice();
  return cexPrice as bigint;
}