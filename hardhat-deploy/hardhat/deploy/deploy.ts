import { DeployFunction } from 'hardhat-deploy/types'

import { deploy } from '../utils/deploy-helpers'
import { BigNumberish, BigNumber as BN } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256');
const addressList = require('../config/allowList.json')


const deployOptions: DeployFunction = async (hre) => {
  const { getNamedSigner, run, network, log } = hre
  const deployer = await getNamedSigner('deployer')


  // Make sure contracts are compiled
  await run('compile')

  log('')
  log('********** Deploying **********', { indent: 1 })
  log('')


  const leaves = addressList.map((x:any) => keccak256(x))
  const tree = new MerkleTree(leaves, keccak256, {sortPairs: true})
  const root = tree.getRoot().toString('hex')
  const hexRoot = tree.getHexRoot()

  console.log("hexRoot: ", hexRoot)

  const contractOutput = await deploy({
    contract: 'Vibers',
    name: 'Vibers',
    args: ['ipfs://QmfYC58HWnG61nzdnZ2NZmd5Yv3QrU6XM9JWW1gXHRPT67/', hexRoot],
    hre,
  })
}



deployOptions.tags = ['vibers']
deployOptions.dependencies = []

export default deployOptions
