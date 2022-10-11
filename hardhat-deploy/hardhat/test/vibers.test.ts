import { Contract, Signer } from 'ethers'
import * as hre from 'hardhat'
import { CreateBundleFn, setup } from './helpers/setup'
const BigNumber = require('bignumber.js');

const { use, should, expect } = require('chai')
const { solidity } = require('ethereum-waffle')

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256');

const web3 = require('web3')


use(solidity)
should()


describe('MerkleAirdrop', function () {
  let contract: Contract
  let user: Signer
  let deployer: Signer

  beforeEach(async () => {
      // call setup function

    console.log("running setup")
    const results = await setup()
    console.log("setup complete")

    // assign variables with results from setup function
    contract = results.vibersToken
    user = results.user
    deployer = results.deployer

    // assign parameters and then call send transaction function
    // let params ={to: await user.getAddress(), value: web3.utils.numberToHex( web3.utils.toWei('1') ) }
    // await deployer.sendTransaction(params)

  })

  const addressList = require('../config/allowList.json')

  describe('token contract ', () => {
    it('Should be able to public mint', async () => {

        console.log("setPublicMintOpen")
        const mintPrice = web3.utils.toWei('0.01')
        console.log('mintPrice', mintPrice)

        const amt: any = '1';
        const price: any = 0.01;
        const overrides: any = {
            value: (price * Math.pow(10, 18) * amt).toString(),
            gasLimit: Math.floor(
              200000 * amt - ((200000 * amt) / 100) * (amt - amt * 2.5)
            ).toString(),
        };

        await contract.connect(deployer).setAllowlistMintOpen(mintPrice);
        await contract.connect(deployer).setPublicMintOpen(mintPrice);

        const userAddress = await user.getAddress()
        console.log('user address',userAddress)

        await contract.connect(user).mint(amt, overrides);
        let tokenBalance = await contract.connect(user).balanceOf(userAddress)

        tokenBalance.should.equal(1)

    })
  })


  describe('merkle tree ', () => {
    it('should be able to verify offchain', async () => {

      const leaves = addressList.map((x:any) => keccak256(x))
      const tree = new MerkleTree(leaves, keccak256, {sortPairs: true})
      const root = tree.getRoot().toString('hex')
      const leaf = keccak256('0xeBd5bF494CCF8a1fC7a42aa2edFB39B3890ea220')
      const proof = tree.getProof(leaf)
      console.log(tree.verify(proof, leaf, root)) // true

      expect(tree.verify(proof, leaf, root)).to.equal(true)

      const badLeaves = ['a', 'x', 'c'].map((x:any) => keccak256(x))
      const badTree = new MerkleTree(badLeaves, keccak256, {sortPairs: true})
      const badLeaf = keccak256('x')
      const badProof = tree.getProof(badLeaf)
      console.log(tree.verify(badProof, leaf, root)) // false

      expect(tree.verify(badProof, leaf, root)).to.equal(false)

    })
  })





  describe('token contract ', () => {
    it('should be able to allowlist mint', async () => {

        console.log("setAllowlistMintOpen")
        const mintPrice = web3.utils.toWei('0.01')
        console.log('mintPrice', mintPrice)

        const amt: any = '2';
        const price: any = 0.01;
        const overrides: any = {
            value: (price * Math.pow(10, 18) * amt).toString(),
            gasLimit: Math.floor(
              200000 * amt - ((200000 * amt) / 100) * (amt - amt * 2.5)
            ).toString(),
        };


        await contract.connect(deployer).setAllowlistMintOpen(mintPrice);

        const leaves = addressList.map((x:any) => keccak256(x))
        const tree = new MerkleTree(leaves, keccak256, {sortPairs: true})
        const root = tree.getRoot().toString('hex')

        const hexRoot = tree.getHexRoot()

        console.log('allowlist root is ', hexRoot)

        const userAddress = await user.getAddress()
        console.log('user address',userAddress)

        const leaf = keccak256(userAddress)
        const proof = tree.getProof(leaf)

        const hexproof = tree.getHexProof(leaf)

        console.log('hexproof', hexproof, 'end')

        console.log(tree.verify(proof, leaf, root)) // true
        expect(tree.verify(proof, leaf, root)).to.equal(true)

        await contract.connect(user).allowlistMint(amt, hexproof, overrides);
        let tokenBalance = await contract.connect(user).balanceOf(  userAddress  )

        tokenBalance.should.equal(2)

    })
  })

})
