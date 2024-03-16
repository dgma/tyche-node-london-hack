import {encodeAbiParameters, keccak256, parseAbiParameters, toHex} from 'viem'
import oracle from "./contracts/oracle";
const getCommitHash = (price: bigint, secret: string): string => {

  return keccak256(encodeAbiParameters(parseAbiParameters('uint256 price, bytes32 secret'),
    [price, toHex(secret)]));
}

export const canCommit = async (): Promise<boolean> => {
  console.log('can commit')
  return Promise.resolve(true);
  // return oracle.read.canCommit();
}

export const commit = async (price: bigint, secret: string): Promise<void> => {
  console.log('commiting', price,'****', secret)
  return Promise.resolve();
  // return oracle.commit(getCommitHash(price, secret));
}