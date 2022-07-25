import DegenAuth from "degen-auth";
import ExtensibleDB from 'extensible-mongoose'
import AppHelper from "../lib/app-helper";

import { ControllerMethod } from "degen-route-loader"
import APIController from "./APIController";
import { createRecord, deleteRecord, findRecords} from "../lib/mongo-helper";

import {ethers} from "ethers";
import FileHelper from '../lib/file-helper.js'
const ERC721_ABI = require('../../src/contracts/ERC721ABI')


import {
    ERC721Balances,
    ERC721BalancesSchema,
    ERC721BalancesDefinition,
    ERC721Transfer,
    ERC721TransferSchema,
    ERC721TransferDefinition,
    ERC721EventDataDefinition } from '../dbextensions/ERC721DBExtensions';


export default class ERC721Controller extends APIController  {


    constructor(public mongoDB:ExtensibleDB){
        super()

    }

    ERC721TransfersByToken: ControllerMethod = async (req: any) => {

        let contractAddress = AppHelper.toChecksumAddress(req.fields.contractAddress)
        let tokenId = req.fields.tokenId
        console.log("Inputs: ", contractAddress, tokenId)

        let result = await findRecords({ tokenId: tokenId, contractAddress: contractAddress }, ERC721TransferDefinition, this.mongoDB)

        console.log("ERC721TransfersByToken", result)
        if (result) return result
    }

    ERC721TransfersByAddress: ControllerMethod = async (req: any) => {

        let to = req.fields.to
        let from = req.fields.from
        let contractAddress = AppHelper.toChecksumAddress(req.fields.contractAddress)
        console.log("Inputs: ",  to, from, contractAddress)

        let items = await this.mongoDB.getModel(ERC721TransferDefinition).find({ to: to, from: from, contractAddress: contractAddress }).sort({ createdAt: -1 })

        if(!items ){
            return {success:false, error:`Could not find records for ${ERC721TransferDefinition.tableName}`}
        }

        items = items.filter(x => typeof x != 'undefined')

        return {success:true, data: items}
    }

    // ****** Methods ********



}
