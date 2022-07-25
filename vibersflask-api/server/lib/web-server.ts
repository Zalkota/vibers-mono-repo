

 import express from 'express'

 import cors from 'cors'
 const formidable = require('express-formidable')


import fs from 'fs'
import path from 'path'

// @ts-ignore
import  history from 'connect-history-api-fallback'
import  bodyParser from 'body-parser'

import web3utils from 'web3-utils'

import http from 'http'
import https from 'https'

import DegenRouteLoader, { Route } from 'degen-route-loader'

import FileHelper from './file-helper'

import APIController from '../controllers/APIController'

const AllRoutes:Array<Route> = FileHelper.readJSONFile('./server/shared/routes/all_routes.json')

export default class WebServer  {

    server:https.Server|http.Server

    app:any

    apiPort:number

    degenRouteLoader:DegenRouteLoader

    constructor(
      public web3:any,
      public serverConfig:any,
      public apiControllers: Array<{name:string, controller: APIController}>
      ){




        this.app = express()

        this.degenRouteLoader = new DegenRouteLoader()

        this.apiPort = this.serverConfig.port? this.serverConfig.port : 3000

        //var server = http.createServer(app);

        let envmode = process.env.NODE_ENV

        if(serverConfig.useHTTPS == true ){
          this.server = https.createServer({
            cert: fs.readFileSync('/etc/letsencrypt/live/vibers.io/fullchain.pem'),
            key: fs.readFileSync('/etc/letsencrypt/live/vibers.io/privkey.pem')
          });
          console.log('--using https--')

        }else{

          this.server = http.createServer(this.app);
        }

        this.app.use(cors());
        this.app.use(formidable())

        //this.app.use(express.json());



    }


    async start(    ){


      //Load all of the api controllers similar to rails
     this.apiControllers.map( controllerData => {

        this.degenRouteLoader.registerController( controllerData.name, controllerData.controller)

      })

      this.degenRouteLoader.loadRoutes( this.app, AllRoutes)





      //host static files from dist for webpage
      const staticFileMiddleware = express.static('cache');
      this.app.use(staticFileMiddleware);
      this.app.use(history({
        disableDotRule: true,
        verbose: true
      }));
      this.app.use(staticFileMiddleware);




      this.app.listen(this.apiPort, () => {
        console.log(`API Server listening at http://localhost:${this.apiPort}`)
      })




    }


}
