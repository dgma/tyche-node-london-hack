import {coinmarketcapKey} from "./env";
import {formatUnits} from "viem";

let cexPrice: string | null = null;
export const getCexPrice = async (): string => {
  if(!cexPrice) await fetchCexPrice();
  return cexPrice as string;
}

const fetchCexPrice = async () => {
  const res = await fetch('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug=ethereum',
    { headers: {
    'X-CMC_PRO_API_KEY': coinmarketcapKey as string,
    }
  })

  if(res.ok) {
    const responsePayload = await res.json();
    return setPrice(responsePayload);
  }
}

const setPrice = (payload: Record<string, any>): void => {
  const price = payload.data['1027'].quote['USD'].price as number;
  const bigIntPrice = BigInt(price);
  cexPrice = formatUnits(bigIntPrice, 8);
}