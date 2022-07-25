 
//import ToadzShopDB, { ShopItem }  from "../lib/toadz-shop-db"
import AppHelper from "../lib/app-helper";

import ExtensibleDB from 'extensible-mongoose'
  
import FileHelper from "../lib/file-helper";

import { AttachedImageDefinition, AttachedImageSchema } from "../dbextensions/ShopDBExtension";
 

const MAX_FILE_SIZE = 10485760 //bytes //10MB
const MAX_ATTACHED_IMAGES_PER_ITEM = 6

export default class AttachedImageController  {



/*


fileData

 {
    _events: [Object: null prototype] {},
    _eventsCount: 0,
    _maxListeners: undefined,
    size: 24229,
    path: '/tmp/upload_4f438e37cfa47e663c2430fac8485f1b',
    name: 'roboflyz.png',
    type: 'image/png',
    hash: null,
    lastModifiedDate: 2022-04-25T23:10:33.550Z,
    _writeStream: WriteStream {
      fd: null,
      path: '/tmp/upload_4f438e37cfa47e663c2430fac8485f1b',
      flags: 'w',
      mode: 438,
      start: undefined,
      pos: undefined,
      bytesWritten: 24229,
      closed: true,
      _writableState: [WritableState],
      _events: [Object: null prototype] {},
      _eventsCount: 0,
      _maxListeners: undefined,
      [Symbol(kFs)]: [Object],
      [Symbol(kIsPerformingIO)]: false,
      [Symbol(kCapture)]: false
    },
    [Symbol(kCapture)]: false
  }


*/

    static async uploadAndAttachImage(fileData: any, parentType: string, parentId: number, mongoDB: ExtensibleDB) {
        

      let {fileIsValid,fileValidationError} = AttachedImageController.validateFile(fileData)
      
      if(!fileIsValid){
        return {success:false, error:'File is invalid: '.concat(fileValidationError) }


      }


        let thumbnailImageData

        try{        
           thumbnailImageData = await FileHelper.getFileDataBinary(fileData)
        }catch(error){
            console.error(error)
        }

 
        if (typeof thumbnailImageData == 'string'){

          let fileName = FileHelper.addRandomSaltToFileName(fileData.name) //thumbnailImage.name.concat(fileNameSalt)
             
          let {savedFile,error} = FileHelper.saveFileToCache(thumbnailImageData, fileName)
          
          if(!savedFile){
            console.log('could not save image file to cache', fileName)
            console.error(error)
            return {success:false, error:'could not save image file to cache'}
          }

          let recordCreate = await AttachedImageController.insertNewUploadedImageRecord(
            AppHelper.escapeString(fileName), parentType, parentId, mongoDB)
          
          //let success = (savedFile && recordCreate)
          if(!recordCreate.success){
            return {success: false, error: recordCreate.error}
          }

        
          return {success:true, insert: recordCreate.insert }
        }

        return {success:false, error:'unknown error' }



    }

  
     
    static async insertNewUploadedImageRecord(filename:string, parentType:string, parentId:number,  mongoDB: ExtensibleDB): Promise<{success:boolean,insert:any,error:any}>{

        let deleted = false 
 
        let result = await mongoDB.getModel(AttachedImageDefinition).create({filename,parentType,parentId,deleted}) 
        .then((insert) => {
         return {success:true, insert: insert, error: null}
        })
        .catch((error) => {
         console.error(error)
         return {success:false, insert: null, error: 'Image insertion error'}
        }) 
 
        return result

    } 

    //implement me 
    static async deleteUploadedImage( ){

      //modify record to say deleted 

      //delete the file from cache folder 

    }

    static validateFile(file:any){

      if(file.name != AppHelper.unescapeString(AppHelper.escapeString(file.name))){
        return {fileIsValid:false, fileValidationError:'File name contains invalid characters'}
      }


      if(file.size > MAX_FILE_SIZE){
        return {fileIsValid:false, fileValidationError:'File size too large'}
      }

      if(file.type != 'image/png' && file.type != 'image/jpeg'){
        return {fileIsValid:false, fileValidationError:'File type invalid'}
      }

      return {fileIsValid:true, fileValidationError:null}
    }


    static async findAttachedImages(parentType:string, parentId:number, mongoDB: ExtensibleDB){

      return await mongoDB.getModel(AttachedImageDefinition).find({
        parentType, parentId 
      })

      
    }


    static async getAttachedImagesData(parentType:string, parentId:number, mongoDB: ExtensibleDB){

      let imagesList = await AttachedImageController.findAttachedImages(parentType,parentId, mongoDB)

      return imagesList.map(x =>{ return {filename:AppHelper.unescapeString(x.filename) }})
      
      
    }

 

 
  

}