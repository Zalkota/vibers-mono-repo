import DegenAuth from "degen-auth";
import ExtensibleDB from 'extensible-mongoose'
import AppHelper from "../lib/app-helper";

import { ControllerMethod } from "degen-route-loader"
import APIController from "./APIController";


export default class AuthController extends APIController  {



    constructor(public mongoDB:ExtensibleDB){
        super()

    }

    ping: ControllerMethod =  async (req: any) => {
         return {success:true, data:'pong'}
    }

    generateChallenge: ControllerMethod = async (req: any) => {

        const publicAddress = AppHelper.toChecksumAddress(req.fields.publicAddress)
        const serviceName = req.fields.serviceName

        let upsertedChallenge  = await DegenAuth.upsertNewChallengeForAccount( this.mongoDB, publicAddress, serviceName )

        console.log('upsertedChallenge',upsertedChallenge)

        return   {success:true, data:{ publicAddress:publicAddress, challenge: upsertedChallenge} }
    }

    generateUserSession: ControllerMethod = async (req: any) => {

        const publicAddress = AppHelper.toChecksumAddress(req.fields.publicAddress)
        const signature = req.fields.signature

        let authToken  = await DegenAuth.generateAuthenticatedSession( this.mongoDB, publicAddress, signature )

        console.log('authToken',authToken)

        return  {success:true, data: {publicAddress:publicAddress, authToken: authToken} }
    }


}
