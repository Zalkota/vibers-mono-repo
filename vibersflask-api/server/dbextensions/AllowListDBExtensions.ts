
import {Mongoose, Schema, Model} from 'mongoose'

import ExtensibleMongoDatabase, { RegisteredModel, DatabaseExtension , TableDefinition} from 'extensible-mongoose'


import { BigNumber } from "ethers";

//used on front end

export interface AllowList {
    publicAddress: String,
    allowlistAmount: String,
    allowlistType: String,
    createdAt: Number
}

// ********* Schemas *********

export const AllowListSchema = new Schema<AllowList>({
    publicAddress: {type: String, index: true},
    allowlistAmount: String,
    allowlistType: {type: String, index: true},
    createdAt: Number
})

export const AllowListDefinition:TableDefinition= {tableName:'allowlist',schema:AllowListSchema}

export default class AllowListDBExtension extends DatabaseExtension  {

      getBindableModels() : Array<TableDefinition>{

        return [
          AllowListDefinition
        ]
    }


}
