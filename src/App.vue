<template>
  <div id="app" class="antialiased text-gray-900 text-lg font-medium flex flex-col min-h-screen" style="font-family: Prompt">
    <router-view class="flex-1 bg-three" style=""/>

  </div>
</template>
<script>


    export default {

        mounted() {
            let date = new Date(2022, 4, 1, 10, 10, 10, 10)
            this.$store.commit('setPublicSaleReleaseDate', date)
            console.log("setPublicSaleReleaseDate", date)
        }
    }
</script>
