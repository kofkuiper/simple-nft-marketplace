import { writable } from "svelte/store";
import type { Signer } from 'ethers'
import { ethers } from "ethers";

export const signer = writable<Signer>(undefined)
export const walletAddress = writable<string>(undefined)

export async function connectWallet() {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        await provider.send("eth_requestAccounts", []);
        await getSigner()
    } catch (error) {
        console.log(error);

    }
}

export async function getSigner() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    const currentSigner = provider.getSigner();
    const signerAddress = await currentSigner.getAddress();
    if (signerAddress) {
        walletAddress.set(signerAddress);
        signer.set(currentSigner);
    }
}