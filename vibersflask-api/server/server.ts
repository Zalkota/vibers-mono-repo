import FileHelper from './lib/file-helper'
import WebServer from './lib/web-server'
import PopulateTraitsTask from './tasks/populateTraitsDB.js'
import Web3 from 'web3'
import AuthController from './controllers/AuthController'
import ERC721Controller from './controllers/ERC721Controller'
import AllowListController from './controllers/AllowListController'

//degen auth
import {DegenAuthExtension} from 'degen-auth'
import ExtensibleMongoDB , {DatabaseExtension} from 'extensible-mongoose'

import AllowListDBExtension from './dbextensions/AllowListDBExtensions'
import ERC721DBExtension from './dbextensions/ERC721DBExtensions'

let envmode = process.env.NODE_ENV

let collectionName = 'vibers'
let serverConfigFile = FileHelper.readJSONFile('./server/serverconfig.json')
let serverConfig = serverConfigFile[envmode]

let dataghostConfigFile = FileHelper.readJSONFile('./server/dataghostconfig.json')
let dataghostConfig = dataghostConfigFile[envmode]

  async function start(){

    console.log('server config: ',serverConfig)

    // validateServerConfig()

    let vibersDB = new ExtensibleMongoDB()
    await vibersDB.init('vibers_'.concat(envmode) )

    let dbExtensions:Array<DatabaseExtension> = []

    dbExtensions.push(...[
      new DegenAuthExtension(vibersDB),
      new AllowListDBExtension(vibersDB),
      new ERC721DBExtension(vibersDB),
    ])


    dbExtensions.map(ext => ext.bindModelsToDatabase())


    let web3 = new Web3( serverConfig.web3provider  )

    console.log('web3 ready with provider ',serverConfig.web3provider )

    //init API Controllers

    let apiControllers = [
      {name:'auth', controller: new AuthController(vibersDB)},
      {name:'allowlist', controller: new AllowListController(vibersDB)},
      {name:'erc721', controller: new ERC721Controller(vibersDB)},
    ]

    let webserver = new WebServer(web3, serverConfig, apiControllers)
    await webserver.start()

    }

 start()
