import FileHelper from './file-helper'
import web3utils from 'web3-utils'
const NODE_ENV = process.env.NODE_ENV
    // const envmode = process.env.NODE_ENV

    // const ContractData:String = FileHelper.readJSONFile('./server/shared/contractdata.json')
    // const ContractLookup:String = FileHelper.readJSONFile('./src/config/generated/contractlookup.json')



    export default class AppHelper  {

        static getEnvironmentName() : string{
            let envName = NODE_ENV ? NODE_ENV : 'development'

            return envName
          }

        static toChecksumAddress(address: string){
            return web3utils.toChecksumAddress(address)
        }

        static sanitizeString(input: string) : string {

            return encodeURI(input)
          }

        static getCombinedAssetId(contractAddress: string , tokenId: string){
            console.log('contractAddress', contractAddress)
            contractAddress = web3utils.toChecksumAddress(contractAddress)

            if(!contractAddress) return null

            return contractAddress.toString().concat('_').concat(tokenId.toString())
        }

       //  static contractCollectionNameToContractAddress(collectionName: string){
       //
       //      let networkName = AppHelper.getNetworkName()
       //
       //     let contractDataForNetwork = contractData[networkName].contracts
       //
       //     for(let [contractName, data] of Object.entries(contractDataForNetwork)){
       //
       //         if( data.name && collectionName && collectionName.toLowerCase() == data.name.toLowerCase()   ){
       //             return data.address
       //         }
       //
       //     }
       //
       //     console.error('ERROR: could not resolve contract address ',collectionName )
       //
       //     return  null
       // }
       //
       //
       //  static contractAddressToCollectionName(contractAddress: string){
       //      if(!contractAddress) return contractAddress
       //
       //
       //      let matchingContract = contractLookup[ contractAddress.toLowerCase()  ]
       //
       //
       //      if(matchingContract ){
       //          return matchingContract.name
       //      }
       //
       //      console.error('ERROR: could not resolve contract name ',contractAddress )
       //      return  null
       //  }

        static getNetworkName(){

            let envName = NODE_ENV

            if(envName == 'production') return 'mainnet'

            return 'rinkeby'
        }

        static generateRandomUUID(){
            return web3utils.randomHex(32).toString()
        }


       /* static mongoIdToNumber(mongoId){
            return mongoId.valueOf()

        }

        static numberToMongoId(n){
            return ObjectId(n)
        }*/
    }
