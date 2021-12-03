<template>
  <router-link v-bind:to="getLinkUrl()" class=" cursor-pointer select-none inline-block m-4 relative"   >

    <img v-bind:src="getImageURL()" width="128" height="128" />

  </router-link>
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

  },
  methods: {
      
      getLinkUrl(){

        //return `https://artblocks.io/token/${this.nftTokenId}.png` 
        return `/collection/${this.collectionName}/${this.nftTokenId}` 
      },

      getImageURL(){

        return `/images/toadz/${this.nftTokenId}.jpg` 

      }
  }
}
</script>
