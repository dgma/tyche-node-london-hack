import {keccak256, toHex} from 'viem'
import oracle from "./contracts/oracle";
const getCommitHash = (price: string, secret: string): string => {
  return keccak256(toHex(`${price}${secret}`));
}

export const canCommit = async (): Promise<boolean> => {
  return oracle.read.canCommit();
}

export const commit = async (price: string, secret: string): Promise<void> => {
  return oracle.commit(getCommitHash(price, secret));
}