
var VibeGraph = require('../index.js')

var Web3 = require('web3')

let web3Config = require('../tests/testconfig.json')

let ERC721ABI = require( '../config/contracts/ERC721ABI.json' )
const IndexerERC721 = require('../indexers/IndexerERC721')


 async function runVibeGraph(){

        let web3 = new Web3( new Web3.providers.WebsocketProvider( web3Config.web3provider, {
            clientConfig:{
                    maxReceivedFrameSize: 10000000000,
                    maxReceivedMessageSize: 10000000000,
                } }) );

        let vibegraphConfig = {

            contracts:[

                    {address:"0x1A275dCA47fd9A88D6221210B02bD1303080Fed8",
                    startBlock: 10922189,
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
