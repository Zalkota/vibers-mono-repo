

 
 const clientConfig = require('../config/clientConfig.json')

 const contractDataLookup = require('../config/generated/contractlookup.json')
 import BigNumber from 'bignumber.js'

export default class BuyTheFloorHelper {

    constructor( ){
      

    }

    static getSocketURL(netId){
      let envmode = process.env.NODE_ENV

      if(netId != 1 && envmode == 'production'){
        envmode = 'staging'
      }

      return clientConfig[envmode].SOCKET_URL


    }
    static getClientConfigForNetworkId(netId){
      if(netId == 1){
        return clientConfig['production'] 
      }
      return clientConfig['development'] 


    }
     

    static getNameFromContractAddress( address,projectId, netId )
  {
    let networkName = 'mainnet'
    if(netId == 5){
      networkName = 'goerli'
    }

    projectId = parseInt(projectId)
    if(isNaN(projectId))projectId=0;

    console.log('get name', contractDataLookup[networkName] , address, projectId)

    let contractData = contractDataLookup[networkName][address.toLowerCase()][projectId]
    if(contractData){
      return contractData.name 
    }
     //this.contractNameLookupTable[address]
 
    return '?'
  }

  static getDecimalsFromContractAddress( address, projectId, netId )
  {
    let networkName = 'mainnet'
    if(netId == 5){
      networkName = 'goerli'
    }

    projectId = parseInt(projectId)
    if(isNaN(projectId))projectId=0;

    console.log('get decimals', contractDataLookup[networkName] , address)
    if(contractDataLookup[networkName][address.toLowerCase()][projectId]){
      return contractDataLookup[networkName][address.toLowerCase()][projectId].decimals  //this.contractNameLookupTable[address]
 
    }
      return null 

  }


  static getFormattedCurrencyAmount( tokenAmount, tokenAddress, netId )
  {
    
        
    let decimals = this.getDecimalsFromContractAddress(tokenAddress, 0, netId)

    if(decimals){
      let amt =  parseFloat(BuyTheFloorHelper.rawAmountToFormatted(tokenAmount,decimals))
      return amt.toFixed(4)
    }

    return '?'

  }

  static getNFTTypeDataFromName(name, chainId){
    let nftTypesArray = BuyTheFloorHelper.getClientConfigForNetworkId(chainId).nftTypes

    let nftTypes = {}

    for(let type of nftTypesArray){
      nftTypes[type.name] = type
    }

    return nftTypes[name]
  }


  static rawAmountToFormatted(amount,decimals)
  {
    return (amount * Math.pow(10,-1 * decimals)).toFixed(decimals);
  }

  static formattedAmountToRaw(amountFormatted,decimals)
  { 
       
    var multiplier = new BigNumber( 10 ).exponentiatedBy( decimals ) ;


    return multiplier.multipliedBy(amountFormatted).toFixed() ;
  }
 
   static getDaysFromBlocks(blocks){
          return parseFloat(blocks / 5760).toFixed(2)
      }


}