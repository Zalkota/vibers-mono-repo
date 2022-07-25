


import MongoInterface from './lib/mongo-interface.js'
import WolfpackInterface from './lib/wolfpack-interface.js'

import FileHelper from './lib/file-helper.js'

import ApiInterface from './lib/api-interface.js'

import PopulateTraitsTask from './tasks/populateTraitsDB.js'
import PopulateCachedNFTTilesTask from './tasks/populateCachedNFTTiles.js'

import Web3 from 'web3'

let envmode = process.env.NODE_ENV

let collectionName = 'vibers'
let serverConfigFile = FileHelper.readJSONFile('./server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]
console.log(serverConfig)

let dataghostConfigFile = FileHelper.readJSONFile('./server/dataghostconfig.json')
let dataghostConfig = dataghostConfigFile[envmode]

  async function start(){






    console.log('server config: ',serverConfig)


    let mongoInterface = new MongoInterface( )
    await mongoInterface.init(  serverConfig.dbName )

    console.log('booting vibegraph interface..')
    await PopulateTraitsTask.runTask({collectionName: collectionName}, mongoInterface)
    await PopulateCachedNFTTilesTask.runTask({collectionName: collectionName},mongoInterface)


    // console.log('boot vibegraph interface ', dataghostConfig.dbName)
    //
    // let vibegraphInterface =  new MongoInterface( dataghostConfig.dbName ) //new WolfpackInterface( dataghostConfig.wolfPackConfig.dbName )


    // let web3 = new Web3( serverConfig.web3provider  )

    //let packetReceiver = new PacketReceiver(web3, mongoInterface, wolfpackInterface, serverConfig)

    // let apiInterface = new ApiInterface(web3,mongoInterface,vibegraphInterface, serverConfig )


    console.log('web3 ready with provider ',serverConfig.web3provider )


    //add this back in later
    //let packetCustodian = new PacketCustodian(web3,mongoInterface, wolfpackInterface, serverConfig)



}


 start()
