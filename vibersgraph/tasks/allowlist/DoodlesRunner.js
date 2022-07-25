
var VibeGraph = require('../index.js')

var Web3 = require('web3')

let web3Config = require('../tests/testconfig.json')

let ERC721ABI = require( '../config/contracts/ERC721ABI.json' )
const IndexerERC20 = require('../indexers/IndexerERC20')


 async function runVibeGraph(){

        // let web3 = new Web3( web3Config.web3provider  )

        let web3 = new Web3( new Web3.providers.WebsocketProvider( web3Config.web3provider, {
            clientConfig:{
                    maxReceivedFrameSize: 10000000000,
                    maxReceivedMessageSize: 10000000000,
                } }) );



        let vibegraphConfig = {

            contracts:[
                             //goerli
                    {address:"0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
                    startBlock: 13430097,
                     type:"ERC721"
                    }

                    ],

            dbName:"vibers_development",
            indexRate: 10*1000,
            courseBlockGap: 8000,
            fineBlockGap: 20,
            logging:true,
            subscribe: true,
            customIndexers:[{
                type:'ERC721',
                abi: ERC721ABI,
                handler: IndexerERC721
             }]
        }

        let vibegraph = new VibeGraph()
        await vibegraph.init( vibegraphConfig )
        vibegraph.startIndexing( web3, vibegraphConfig )

    }


    runVibeGraph()
