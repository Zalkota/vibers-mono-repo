 
import FileHelper from './lib/file-helper.js'

import VibeGraph from 'vibegraph'

import IndexerBlockStore from './lib/IndexerBlockStore.js' 
  

import Web3 from 'web3'

let envmode = process.env.NODE_ENV


let serverConfigFile = FileHelper.readJSONFile('./market-api-server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

let dataghostConfigFile = FileHelper.readJSONFile('./market-api-server/dataghostconfig.json')
let dataghostConfig = dataghostConfigFile[envmode]

let BlockStoreABI = FileHelper.readJSONFile('./src/contracts/BlockStoreABI.json')
 
 

  async function start(){

    console.log('dataghost config: ',dataghostConfig)


    
    let web3 = new Web3( serverConfig.web3provider  )
 
    console.log('web3 ready with provider ',serverConfig.web3provider )

   
    let vibeGraphConfig = {  
      contracts:dataghostConfig.vibeGraphConfig.contracts,
       
      dbName: dataghostConfig.vibeGraphConfig.dbName,
      //url: web3Config.dbURI,
      //port: parseInt(web3Config.dbPort),
      indexRate: 10*1000,
      fineBlockGap: dataghostConfig.vibeGraphConfig.fineBlockGap,
      courseBlockGap: dataghostConfig.vibeGraphConfig.courseBlockGap,
      logging: dataghostConfig.vibeGraphConfig.logging,
       
      customIndexers:[{
          type:'BlockStore', 
          abi: BlockStoreABI ,  
          handler: IndexerBlockStore 
       }]
  }



    let vibeGraph = new VibeGraph()
    await vibeGraph.init( vibeGraphConfig )
    vibeGraph.startIndexing( web3, vibeGraphConfig )  
 
     

} 
 



 
 start()