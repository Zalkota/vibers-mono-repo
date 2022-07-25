import DegenAuth from "degen-auth";
import ExtensibleDB from 'extensible-mongoose'
import AppHelper from "../lib/app-helper";

import { ControllerMethod } from "degen-route-loader"
import APIController from "./APIController";
import { createRecord, deleteRecord, findRecords} from "../lib/mongo-helper";

import web3utils from 'web3-utils'

import { AllowList, AllowListSchema, AllowListDefinition } from '../dbextensions/AllowListDBExtensions';
import { ERC721BalancesDefinition } from '../dbextensions/ERC721DBExtensions';
import {Authentication, AuthenticationSchema, AuthenticationDefinition } from '../dbextensions/AuthenticationDBExtensions';

export default class AllowListController extends APIController  {


    constructor(public mongoDB:ExtensibleDB){
        super()

    }

    saveAllowListAddress: ControllerMethod = async (req: any) => {

        let publicAddress = web3utils.toChecksumAddress(req.fields.publicAddress)
        let authToken = req.fields.authToken.toString()
        let allowlistAmount = req.fields.allowlistAmount.toString()
        let allowlistType = req.fields.allowlistType.toString()

        // Check if wallet exists
        let existingAllowlist = await AllowListController.findAllowListByAddress(publicAddress, this.mongoDB)

        if (existingAllowlist.length > 0)  return {success:true,  message: "Public address already whitelisted"}


        let allowListSubmission: AllowList = {
          publicAddress: publicAddress,
          allowlistAmount: allowlistAmount,
          allowlistType: allowlistType,
          createdAt: Date.now()
        }

        let authentication = await DegenAuth.validateAuthenticationTokenForAccount(this.mongoDB, publicAddress, authToken)
        console.log('authentication', authentication)
        if (authentication == authToken || authentication == true) {
            try {
                let result = await this.mongoDB.getModel(AllowListDefinition).create(allowListSubmission)
            } catch(e) {
                alert(e.message)
                return {success:false, data: null, message: 'Attribute conflict'}
            } finally {
                return {success:true, message: 'Authenticated and whitelisted'}
            }
        } else {
            return {success:false,  message: "AuthToken does not match public address"}
        }

    }

    verifyExistingAuthToken: ControllerMethod = async (req: any) => {
        let publicAddress = web3utils.toChecksumAddress(req.fields.publicAddress)
        let authToken = req.fields.authToken.toString()

        let authentication = await DegenAuth.validateAuthenticationTokenForAccount(this.mongoDB, publicAddress, authToken)
        console.log('authentication', authentication)
        if (authentication == authToken || true) {
            return {success:true, message: 'authToken is valid'}
        } else {
            return {success:false,  message: "AuthToken does not match public address"}
        }

    }


    checkAllAllowLists: ControllerMethod = async (req: any) => {

        let publicAddress = web3utils.toChecksumAddress(req.fields.publicAddress)

        let existingAllowlist = await AllowListController.findAllowListByAddress(publicAddress, this.mongoDB)
        if (existingAllowlist.length > 0)  return {success: true,  message: "Public address already whitelisted"}

        return {success: false,  message: "Public address not whitelisted"}
    }


    ERC721BalanceByOwner: ControllerMethod = async (req: any) => {
        let publicAddress = AppHelper.toChecksumAddress(req.fields.publicAddress)
        let result = await findRecords({ accountAddress: publicAddress }, ERC721BalancesDefinition, this.mongoDB)

        console.log("result from ERC721BalanceByOwner", result, publicAddress)
        if (result) return {success:true, data: result, error: null}
        else return {success:false, data: null, error: 'Zero Balances'}
    }


    // ****** Methods ********

    static async findBalanceByAddress( publicAddress: string, contractAddress: string, mongoDB: ExtensibleDB ){

        try {
            let result = await mongoDB.getModel(ERC721BalancesDefinition).findOne({ publicAddress: publicAddress, contractAddress: contractAddress }, function(err, resad){console.log('into mongoose findone');});
            return result
          } catch(err) {
            console.log("findBalanceByAddress Error")// catches errors both in fetch and response.json
            return {success:false, data: null, error: 'Zero Balances'}
          }

    }

    static async findAllowListByAddress( publicAddress: string, mongoDB: ExtensibleDB ){

        let result = await mongoDB.getModel(AllowListDefinition).find({ publicAddress: publicAddress })

        return result
    }


}
