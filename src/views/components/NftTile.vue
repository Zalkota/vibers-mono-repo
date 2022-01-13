<template>
    <div class="w-full bg-white rounded-lg sahdow-lg overflow-hidden flex flex-col justify-center  border border-gray-300">
        <router-link v-bind:to="getLinkUrl()" class=" cursor-pointer select-none inline-block m-4 relative"   >
            <!-- <img v-bind:src="getImageURL()" width="256" height="256" /> -->
            <img class="object-center object-cover h-auto w-full" v-bind:src="getImageURL()" alt="photo">
            <div class="text-left px-5 pt-4 pb-2">
                <h4 class="text-sm text-gray-900 font-bold mb-2">Cosmic Cap #</h4>
            </div>
        </router-link>
  </div>
</template>


<script>


export default {
  name: 'NftTile',
  props: ['collectionName',  'nftTokenId'],
  data() {
    return {

    }
  },
  created(){

      console.log('collection name:', this.collectionName, this.nftTokenId)

  },
  methods: {

      getLinkUrl(){

        //return `https://artblocks.io/token/${this.nftTokenId}.png`
        return `/collection/${this.collectionName}/${this.nftTokenId}`
      },

      getImageURL(){

        // return `/images/toadz/${this.nftTokenId}.jpg`

        return `https://cosmic-caps.s3.amazonaws.com/Final_10000_caps/${this.nftTokenId}.png`

      }
  }
}
</script>
