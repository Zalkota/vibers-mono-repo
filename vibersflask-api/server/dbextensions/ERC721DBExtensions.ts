
import {Mongoose, Schema, Model} from 'mongoose'

import ExtensibleMongoDatabase, { RegisteredModel, DatabaseExtension , TableDefinition} from 'extensible-mongoose'


import { BigNumber } from "ethers";

//used on front end
export interface ERC721EventData {
    contractAddress: String,
    startBlock: String,
    endBlock: Number,
    eventsCount: Number
}

export interface ERC721Balances {
    contractAddress: String,
    accountAddress: String,
    tokenIds: [Number],
    lastUpdatedAt: Number
}

export interface ERC721Transfer {
    from: String,
    to: String,
    tokenId: Number,
    contractAddress: String,
    blockNumber: Number,
    transactionIndex: Number,
    createdAt: Number
}


// ********* Schemas *********

export const ERC721EventDataSchema = new Schema<ERC721EventData>({
    contractAddress: {type: String, index: true},
    startBlock: {type: String, index: true},
    endBlock: Number,
    eventsCount: Number
})


export const ERC721BalancesSchema = new Schema<ERC721Balances>({
    contractAddress: {type: String, index: true},
    accountAddress: {type: String, index: true},
    tokenIds: [Number],
    lastUpdatedAt: Number
})

export const ERC721TransferSchema = new Schema<ERC721Transfer>({
    from: {type: String, index: true},
    to: {type: String, index: true},
    tokenId: Number,
    contractAddress: String,
    blockNumber: Number,
    transactionIndex: Number,
    createdAt: Number
}, { collection: ''})


export const ERC721BalancesDefinition:TableDefinition= {tableName:'erc721_balances',schema:ERC721BalancesSchema}
export const ERC721TransferDefinition:TableDefinition= {tableName:'erc721_transfers',schema:ERC721TransferSchema}
export const ERC721EventDataDefinition:TableDefinition= {tableName:'event_datas',schema:ERC721EventDataSchema}

export default class ERC721DBExtension extends DatabaseExtension  {

      getBindableModels() : Array<TableDefinition>{

        return [
          ERC721BalancesDefinition,
          ERC721TransferDefinition,
          ERC721EventDataDefinition
        ]
    }

}
