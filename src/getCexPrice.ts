import {coinmarketcapKey} from "./env";

let cexPrice: number | null = null;
export const getCexPrice = async (): number => {
  if(!cexPrice) await fetchCexPrice();
  return cexPrice as number;
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
  cexPrice = payload.data['1027'].quote['USD'].price;
}