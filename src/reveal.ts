import oracle from "./contracts/oracle";

export const reveal = (price: number, secret: string) => {
  return oracle.reveal(price, secret);
}

export const canReveal = () => {
  return oracle.read.canReveal();
}