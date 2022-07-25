
import {Mongoose, Schema, Model} from 'mongoose'

import ExtensibleMongoDatabase, { RegisteredModel, DatabaseExtension , TableDefinition} from 'extensible-mongoose'


import { BigNumber } from "ethers";

//used on front end

export interface Authentication {
    publicAddress: String,
    authToken: String,
    createdAt: [Number],
}

// ********* Schemas *********

export const AuthenticationSchema = new Schema<Authentication>({
    publicAddress: {type: String, index: true},
    authToken: String,
    createdAt: [Number],
})

export const AuthenticationDefinition:TableDefinition= {tableName:'authenicationtokens',schema:AuthenticationSchema}

export default class AuthenticationDBExtension extends DatabaseExtension  {

      getBindableModels() : Array<TableDefinition>{

        return [
          AuthenticationDefinition
        ]
    }

}
