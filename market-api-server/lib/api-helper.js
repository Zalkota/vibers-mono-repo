
    import Web3Helper from './web3-helper.js'
    import BidPacketUtils from '../../src/js/bidpacket-utils.js'

    import EIP712Utils from '../../src/js/EIP712Utils.js'

    import web3utils from 'web3-utils'
    //import ApplicationManager from './application-manager.js'


    export default class APIHelper  {

        constructor(   ){


        }

        //http://localhost:3000/api/v1/somestuff
        static async handleApiRequest(request, appId, wolfpackInterface, mongoInterface){

            let inputData = request.body
            grandrequest.body)


            //save a new buy or sell order to the server
            if(inputData.requestType == 'save_new_order'){

                let inputParameters = inputData.input

                let results = await APIHelper.saveNewOrder(inputParameters , mongoInterface)

                if(!results.success){
                    return results
                }

                //await ApplicationManager.logNewRequest(appId,inputData.requestType,inputParameters,results, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }


            if(inputData.requestType == 'get_orders_for_token'){
                let inputParameters = inputData.input

                let results = await APIHelper.findAllOrdersByToken(inputParameters.contractAddress, inputParameters.tokenId , mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'get_orders_for_token_range'){
                let inputParameters = inputData.input


                let results = await APIHelper.findAllOrdersByTokenRange(inputParameters.contractAddress, inputParameters.tokenIdStart, inputParameters.tokenIdEnd , mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'get_orders_for_account'){
                let inputParameters = inputData.input

                let results = await APIHelper.findAllOrdersByAccount(inputParameters.accountAddress , mongoInterface)

                return {success:true, input: inputParameters, output: results  }

            }



            // ERC 721

            if(inputData.requestType == 'ERC721_balance_by_owner'){

                let inputParameters = inputData.input


                let results = await APIHelper.findAllERC721ByOwner(inputParameters.publicAddress, inputParameters.filterNFTcontracts  , wolfpackInterface)


                return {success:true, input: inputParameters, output: results  }
            }



            if(inputData.requestType == 'ERC721_balance_by_contract'){

                let inputParameters = inputData.input


                let results = await APIHelper.findAllERC721ByContract(inputParameters.contractAddress , wolfpackInterface)


                return {success:true, input: inputParameters, output: results  }
            }

            if(inputData.requestType == 'ERC721_by_token'){

                let inputParameters = inputData.input

                let results = await APIHelper.findAllERC721ByTokenId(inputParameters.contractAddress,inputParameters.tokenId , wolfpackInterface)


                return {success:true, input: inputParameters, output: results  }
            }

            //traits data

            if(inputData.requestType == 'all_collection_traits'){

                let inputParameters = inputData.input

                let results = await APIHelper.getTraitsListForCollection( inputParameters.collectionName , mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }


            if(inputData.requestType == 'ERC721_by_trait_value'){

                let inputParameters = inputData.input

                let results = await APIHelper.findAllERC721ByTraitValue( inputParameters.collectionName, inputParameters.traitName ,inputParameters.traitValue, mongoInterface)

                return {success:true, input: inputParameters, output: results  }
            }


        }








        static validateOrderData(orderData){

            if(typeof orderData.chainId == 'undefined') return false;
            if(typeof orderData.storeContractAddress == 'undefined') return false;


            if(typeof orderData.orderCreator == 'undefined') return false;
            if(typeof orderData.nftContractAddress == 'undefined') return false;
            if(typeof orderData.nftTokenId == 'undefined') return false;
            if(typeof orderData.currencyTokenAddress == 'undefined') return false;
            if(typeof orderData.currencyTokenAmount == 'undefined') return false;

            if(typeof orderData.nonce == 'undefined') return false;
            if(typeof orderData.expires == 'undefined') return false;
            if(typeof orderData.signature == 'undefined') return false;

            return true
        }

        static async saveNewOrder( inputParameters, mongoInterface ){
            //validate the order

            let recoveredSigner = EIP712Utils.recoverOrderSigner(  inputParameters   )




            let isValid = APIHelper.validateOrderData(inputParameters)

            if(!isValid){
                return { success:false, message:"invalid input parameters for order" }
            }

            let newOrderData = {
                chainId: parseInt(inputParameters.chainId),
                storeContractAddress: web3utils.toChecksumAddress(inputParameters.storeContractAddress),

                orderCreator: web3utils.toChecksumAddress(inputParameters.orderCreator),
                isSellOrder: !!inputParameters.isSellOrder,
                nftContractAddress: web3utils.toChecksumAddress(inputParameters.nftContractAddress),
                nftTokenId: parseInt(inputParameters.nftTokenId),
                currencyTokenAddress: web3utils.toChecksumAddress(inputParameters.currencyTokenAddress),
                currencyTokenAmount:  (inputParameters.currencyTokenAmount).toString(),
                nonce: inputParameters.nonce.toString(),
                expires: parseInt(inputParameters.expires),
                signature: inputParameters.signature.toString()
            }

            //check the signature for validity here

            let signerIsValid = recoveredSigner.toLowerCase() == newOrderData.orderCreator.toLowerCase()

            if(!signerIsValid) return {success:false,  message: "Invalid signature"}



            let existingOrder = await mongoInterface.getMarketOrdersModel().findOne({signature: newOrderData.signature} )
            if(existingOrder)  return {success:false,  message: "Order already saved"}

            let inserted = await mongoInterface.getMarketOrdersModel().insertOne(newOrderData)

            return {success:true,  insertion: inserted}
        }




        //   add limits

        static async findAllOrdersByToken(contractAddress, tokenId, mongoInterface){
            contractAddress = web3utils.toChecksumAddress(contractAddress)
            tokenId = parseInt(tokenId)
            return await mongoInterface.getMarketOrdersModel().find({nftContractAddress: contractAddress, nftTokenId:tokenId, hasBeenBurned: {$ne: true }  })
        }

        static async findAllOrdersByTokenRange(contractAddress, tokenIdMin, tokenIdMax, mongoInterface){
            contractAddress = web3utils.toChecksumAddress(contractAddress)
            tokenIdMin = parseInt(tokenIdMin)
            tokenIdMax = parseInt(tokenIdMax)
            return await mongoInterface.getMarketOrdersModel().find({nftContractAddress: contractAddress, nftTokenId:{$gte:tokenIdMin,$lte:tokenIdMax}, hasBeenBurned:{$ne: true }  })
        }

        static async findAllOrdersByAccount(accountAddress, mongoInterface){
            accountAddress = web3utils.toChecksumAddress(accountAddress)
            return await mongoInterface.getMarketOrdersModel().find({accountAddress: accountAddress, hasBeenBurned:{$ne: true } })
        }



        static async findAllERC721ByOwner(publicAddress,filterNFTContracts, mongoInterface){
            publicAddress = web3utils.toChecksumAddress(publicAddress)



            if(filterNFTContracts && filterNFTContracts.length > 0){
                filterNFTContracts = filterNFTContracts.map( x => web3utils.toChecksumAddress(x) )
                return await mongoInterface.getERC721BalancesModel().find({accountAddress: publicAddress, contractAddress: {$in:  filterNFTContracts  } })
            }


            return await mongoInterface.getERC721BalancesModel().find({accountAddress: publicAddress })
        }



        static async findAllERC721ByContract(contractAddress,mongoInterface){
            contractAddress = web3utils.toChecksumAddress(contractAddress)
            return await mongoInterface.getERC721BalancesModel().find({contractAddress: contractAddress })
        }

        static async findAllERC721ByTokenId(contractAddress,tokenId,mongoInterface){
            contractAddress = web3utils.toChecksumAddress(contractAddress)
            return await mongoInterface.getERC721BalancesModel().find({contractAddress: contractAddress, tokenIds:tokenId })
        }

        static async getTraitsListForCollection(collectionName,mongoInterface){

            collectionName = APIHelper.sanitizeString(collectionName)

            let results = await mongoInterface.getTraitsModel().find({collectionName: collectionName })   // mongoInterface.findAll('nft_traits',{collectionName: collectionName })

            return results.map((x) =>  {
                return {collectionName: x.collectionName,traitType: x.traitType, value: x.value}
             })
        }



        static async findAllERC721ByTraitValue(collectionName,traitName,traitValue,mongoInterface){
            collectionName = APIHelper.sanitizeString(collectionName)
            traitName = APIHelper.sanitizeString(traitName)
            traitValue = APIHelper.sanitizeString(traitValue)

                console.log('find ', collectionName, traitName , traitValue)
            return await mongoInterface.getTraitsModel().find({collectionName: collectionName, traitType: traitName, value: traitValue })


            //return await mongoInterface.getTraitsModel().findOne({collectionName: collectionName })

        }


        static sanitizeString(s){
            return s.replace('$','')
        }

    }
