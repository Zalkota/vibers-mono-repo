

//import axios from "axios";
const axios = require('axios')

//import AppHelper from './app-helper.js'

const AllRoutes = require('../config/all_routes.json')

 const clientConfig = require('../config/clientConfig.json')

 const envmode = process.env.NODE_ENV

//export default class RestAPIHelper {

  export function  getBaseURI(){

    let externalRoutes = clientConfig[envmode].externalRoutes

    //from config file

    return externalRoutes.api //'http://localhost:3000'
  }


  export function  resolveURIFromRouteName(routeName){


    for(let route of (AllRoutes)){

      if(route.method.toLowerCase() == routeName.toLowerCase()){

        let matchingRouteURI = route.uri
        return getBaseURI().concat(matchingRouteURI)
      }
    }

    return undefined

  }

//}


export async function resolveRoutedApiQuery(routeName, inputData){

  let uri = resolveURIFromRouteName( routeName )

  console.log('resolved uri', uri , inputData )

  return await resolveRestQuery(uri,inputData)
}


export async function resolveRestQuery(uri, inputData){

  return new Promise(   (resolve, reject) => {

    axios.post(uri, inputData )
    .then((res) => {

         console.log('res.data',res.data)
         let results = res.data


          resolve(results)

     }) .catch((error) => {
         console.error('rest error', error)
         reject(error)
     })

 });

}
