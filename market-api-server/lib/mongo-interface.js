import  Mongoose  from 'mongoose'
 
 

const TraitSchema = new Mongoose.Schema({
  collectionName: {
    type: String, index: true
  },
  traitType: {
    type: String, index: true
  },
  value: {
    type: String, index: true
  },
  tokenIdArray: {
    type: [Number]
  }  
 
})

const MarketOrdersSchema = new Mongoose.Schema({ 
  chainId: {
    type: Number
  },
  storeContractAddress: {
    type: String
  },
  orderCreator: {
    type: String
  },
  isSellOrder: {
    type: Boolean
  },
  nftContractAddress: {
    type: String
  },
  nftTokenId: {
    type: Number
  },
  currencyTokenAddress: {
    type: String
  },
  currencyTokenAmount: {
    type: Number
  },
  nonce: {
    type: Number
  },
  expires: {
    type: Number
  },
  signature: {
    type: String
  }
 
})

const ERC721BalancesSchema = new Mongoose.Schema({
  contractAddress: {
    type: String, index: true
  },
  accountAddress: {
    type: String, index: true
  } ,
  tokenIds: {
    type: [Number]
  }  
   
 
})



const APIApplicationSchema = new Mongoose.Schema({
  publicAddress: {
    type: String, index: true
  },
  applicationID: {
    type: Number 
  } 
   
 
})

const AppEpochCounterSchema = new Mongoose.Schema({
  publicAddress: {
    type: String, index: true
  },
  epochHour: {
    type: Number 
  } 
   
 
})


const traitsModel = Mongoose.model('nft_traits', TraitSchema)

const marketOrdersModel = Mongoose.model('market_orders', MarketOrdersSchema)

const erc721BalancesModel = Mongoose.model('erc721_balances', ERC721BalancesSchema)

const apiApplicationModel = Mongoose.model('api_application', APIApplicationSchema)

const appEpochCounterModel = Mongoose.model('app_epoch_counter', AppEpochCounterSchema)
 


export default class MongoInterface  {

    constructor( ){
      
    }

    async init( dbName , config )
    {

      
      let host = 'localhost'
      let port = 27017

      if(config && config.url)
      {
        host = config.url
      }
      if(config && config.port)
      {
        port = config.port
      }

     
      if(dbName == null)
      {
        console.log('WARNING: No dbName Specified')
        process.exit() 
      }

      const url = 'mongodb://' + host + ':' + port + '/' + dbName
      await Mongoose.connect(url, {})
      console.log('connected to ', url, dbName)
    }

  getAPIApplicationModel(){
    return apiApplicationModel
  }

  getTraitsModel() {
    return traitsModel
  }

  getMarketOrdersModel(){
    return marketOrdersModel
  }

  getERC721BalancesModel(){
    return erc721BalancesModel
  }

  getAppEpochCounterModel(){
    return appEpochCounterModel
  }



}
