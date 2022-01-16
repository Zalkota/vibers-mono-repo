<template>

    <div class="w-full p-0 flex flex-col md:flex-row ">
        <div class="flex-1 " v-for="item in inputArray.children" :key="item.title">
            <!-- lg:inline-block -->
            <t-dropdown class="w-full my-1">
              <div
                class="inline-block items-left md:mx-2"
                slot="trigger"
                slot-scope="{
                  mousedownHandler,
                  focusHandler,
                  blurHandler,
                  keydownHandler,
                  isShown
                }"
              >
                <button
                  class="text-md text-left w-full p-2 text-gray-700 pr-3 rounded-md bg-white focus:outline-none focus:shadow-solid transition duration-150 ease-in-out border border-gray-400"
                  :class="{ 'border-gray-300 bg-gray-500 text-white ': isShown }"
                  aria-label="User menu"
                  aria-haspopup="true"
                  @mousedown="mousedownHandler"
                  @focus="focusHandler"
                  @blur="blurHandler"
                  @keydown="keydownHandler"
                >

                    <span class="px-2 inline-block text-sm">{{item.title}}</span> <span class="float-right" ><i class="fas fa-caret-down "></i></span>
                </button>
              </div>

              <div slot-scope="{ hide, blurHandler }" class="md:mx-2 origin-top-right absolute left-0 top-0 shadow-lg text-md text-light bg-white text-gray-900 overflow-y-scroll h-64 w-full" style="">

                  <FilterDropdownList
                    v-for="row in item.children"
                    :key="row.title"
                    v-bind:parentTitle="item.title"
                    v-bind:itemData="row"
                    v-bind:onClickCallback="onClickCallback"
                   />

              </div>
            </t-dropdown>

        </div>
    </div>

</template>

<script>

import FilterDropdownList from './FilterDropdownList'

export default {
  name: 'FilterDropdown',
  props: ['onClickCallback','inputArray'],
  components:{FilterDropdownList},
  data() {
    return {
      itemData: {},

    }
  },
  created(){

  },
  methods: {}
}
</script>
