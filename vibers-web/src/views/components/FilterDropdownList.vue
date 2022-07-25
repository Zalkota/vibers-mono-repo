<template>
    <div  @click="clickedButton" class="w-full px-4 py-2 text-left font-medium leading-5 text-sm hover:bg-gray-100 focus:outline-none cursor-pointer transition duration-150 ease-in-out text-gray-900 no-underline">
         {{ itemData.title  }}
     </div>

</template>

<script>
export default {
  name: 'FilterDropdownList',
  props: ['onClickCallback','itemData','searchQuery','parentTitle'],
  components:{},
  data() {
    return {

    }
  },
  created(){

  },
  methods: {
      clickedButton: function( )
      {
        this.onClickCallback( {parent: this.parentTitle , leaf: this.itemData.title} )
      }
  }
}
</script>
