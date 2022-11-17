import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, constants, BigNumber } from 'ethers'
import { Marketplace } from "../typechain-types";
import { NFT } from "../typechain-types/contracts/NFT.sol";
import { TerosoftToken } from "../typechain-types/contracts/Token.sol";

function toWei(value: number) {
    return ethers.utils.parseEther(value.toString())
}

function fromWei(value: BigNumber) {
    return Number(ethers.utils.formatEther(value))
}

describe('Marketplace', function () {
    let nft: NFT
    let marketplace: Marketplace
    let payToken: TerosoftToken
    let owner: Signer
    let buyer1: Signer
    let buyer2: Signer

    it('should deployed', async function () {
        [owner, buyer1, buyer2] = await ethers.getSigners()

        const NFTContract = await ethers.getContractFactory('NFT')
        nft = await NFTContract.connect(owner).deploy('Terosoft Collection', 'Tero NFT')
        await nft.deployed()
        expect(nft.address).not.to.be.null

        const Token = await ethers.getContractFactory('TerosoftToken')
        payToken = await Token.connect(owner).deploy()
        await payToken.deployed()
        expect(payToken.address).not.to.be.null

        const Marketplace = await ethers.getContractFactory('Marketplace')
        marketplace = await Marketplace.connect(owner).deploy(payToken.address)
        await marketplace.deployed()
        expect(marketplace.address).not.to.be.null
    })

    it('should mint nft', async function () {
        const to = await owner.getAddress()
        const uri = 'www.image.com'

        await expect(nft.connect(owner).safeMint(to, uri)).to.emit(nft, 'Transfer').withArgs(constants.AddressZero, to, 0)
    })

    it('should revert with the right error if seller call listNFT(), but not approve NFT to Marketplace contract', async function () {
        await expect(marketplace.connect(owner).listNFT(nft.address, 0, toWei(0.001))).to.revertedWith('ERC721: caller is not token owner or approved')
    })

    it('should listNFT', async function () {
        const approveTx = await nft.connect(owner).approve(marketplace.address, 0)
        await approveTx.wait()
        await expect(marketplace.connect(owner).listNFT(nft.address, 0, toWei(0.001))).to.emit(marketplace, 'Listed').withArgs(nft.address, 0, await owner.getAddress(), toWei(0.001))
    })

    it('should buy', async function () {
        const tx = await payToken.connect(owner).transfer(await buyer1.getAddress(), toWei(10))
        await tx.wait()

        const approveTx = await payToken.connect(buyer1).approve(marketplace.address, toWei(0.001))
        await approveTx.wait()

        await expect(marketplace.connect(buyer1).buy(nft.address, 0, toWei(0.001))).to.emit(marketplace, 'Bought').withArgs(nft.address, 0, await buyer1.getAddress(), toWei(0.001))
        expect(await nft.ownerOf(0)).to.equals(await buyer1.getAddress())
    })

    it('should list nft [buyer1]', async function () {
        const approveTx = await nft.connect(buyer1).approve(marketplace.address, 0)
        await approveTx.wait()

        await expect(marketplace.connect(buyer1).listNFT(nft.address, 0, toWei(0.002))).to.emit(marketplace, 'Listed').withArgs(nft.address, 0, await buyer1.getAddress(), toWei(0.002))
    })

    it('should revert with the right error if caller is not buyer1', async function() {
        await expect(marketplace.connect(buyer2).cancelListing(nft.address, 0)).to.revertedWith('!seller')
    })

    it('should cancel listed nft', async function() {
        await expect(marketplace.connect(buyer1).cancelListing(nft.address, 0)).to.emit(marketplace, 'Canceled').withArgs(nft.address, 0, await buyer1.getAddress(), toWei(0.002))
    })
})