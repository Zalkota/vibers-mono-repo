# 🎨 Solidity Template Monorepo


# Common Hardhat Commands

```
npm install
npx hardhat compile
npx hardhat test
npx hardhat deploy --network rinkeby
npx hardhat verify --network rinkeby 0x489bd604f639ee8eb937f6401fa8de3a9a3f4a9e "ipfs://QmfYC58HWnG61nzdnZ2NZmd5Yv3QrU6XM9JWW1gXHRPT67/"
```

https://hardhat.org/plugins/nomiclabs-hardhat-etherscan.html


# 🏄‍♂️ Quick Start (contracts)

Create the .env file in /packages/hardhat according to .env.template

```bash
yarn install
yarn contracts build
yarn contracts test mainnet
```


## How to Deploy

```
cd packages/hardhat

yarn deploy --network rinkeby

yarn etherscan-verify --network rinkeby --license MIT
```




🔏 Edit your smart contract `*.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app
