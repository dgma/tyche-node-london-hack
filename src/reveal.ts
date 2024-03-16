import oracle from "./contracts/oracle";

export const reveal = (price: bigint, secret: string) => {
  console.log(process.pid, 'revealing', price, '***', secret);
  return Promise.resolve()
  // return oracle.reveal(encodeAbiParameters(parseAbiParameters('uint256 price, bytes32 secret'),
  //     [price, toHex(secret)]));
}

export const canReveal = () => {
  console.log(process.pid, 'can reveal');
  return Promise.resolve(true);
  // return oracle.read.canReveal();
}