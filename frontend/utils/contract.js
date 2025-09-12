import { ethers } from "ethers";
import AccessControlAbi from "../contracts/AccessControl.json";

export function getContract(provider) {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, AccessControlAbi.abi, signer);
}
