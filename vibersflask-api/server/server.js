import MongoInterface from './lib/mongo-interface.js'
import WolfpackInterface from './lib/wolfpack-interface.js'

import FileHelper from './lib/file-helper.js'

import ApiInterface from './lib/api-interface.js'

import PopulateTraitsTask from './tasks/populateTraitsDB.js'

import Web3 from 'web3'

let envmode = process.env.NODE_ENV

let collectionName = 'vibers'
let serverConfigFile = FileHelper.readJSONFile('./server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

let dataghostConfigFile = FileHelper.readJSONFile('./server/dataghostconfig.json')
let dataghostConfig = dataghostConfigFile[envmode]

  async function start(){


    console.log('server config: ',serverConfig)

    let mongoInterface = new MongoInterface( )
    await mongoInterface.init(  serverConfig.dbName )

    // Populate DB
    console.log('booting vibegraph interface..')

    //Vibegraph Interface
    console.log('boot vibegraph interface ', dataghostConfig.dbName)
    let vibegraphInterface =  new MongoInterface( dataghostConfig.dbName ) //new WolfpackInterface( dataghostConfig.wolfPackConfig.dbName )

    //Web3
    let web3 = new Web3( serverConfig.web3provider  )

    // Express API Server
    let apiInterface = new ApiInterface(web3,mongoInterface,vibegraphInterface, serverConfig )

    console.log('web3 ready with provider ',serverConfig.web3provider )




}


 start()
