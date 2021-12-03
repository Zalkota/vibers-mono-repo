<template>

    <div class="w-full p-0 flex flex-row">
        <div class="w-full lg:w-auto block lg:inline-block" v-for="item in navConfig.dropdowns" :key="item.title">
            <t-dropdown  class="w-full" >
              <div
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
                  class="flex text-md  p-2 m-1 mx-2 text-gray-700 items-center pr-3 rounded-md bg-white focus:outline-none focus:shadow-solid transition duration-150 ease-in-out border-1  border-gray-300"
                  :class="{ 'border-gray-300 bg-gray-500 text-white ': isShown }"
                  aria-label="User menu"
                  aria-haspopup="true"
                  @mousedown="mousedownHandler"
                  @focus="focusHandler"
                  @blur="blurHandler"
                  @keydown="keydownHandler"
                >

                    <span class="px-2">{{item.title}}</span> <i class="fas fa-caret-down "></i>
                </button>
              </div>

              <div slot-scope="{ hide, blurHandler }" class="origin-top-right absolute left-0 shadow-lg text-md text-light bg-gray-200 text-gray-900 overflow-y-scroll h-64" style="width: 11rem;">

                <router-link
                :to="row.url"
                v-for="row in item.rows"

                :key="row.title"
                class="block w-full px-4 py-2 font-normal leading-5 hover:bg-gray-300 hover:font-medium focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out text-gray-900 no-underline"
                role="menuitem"
                @blur="blurHandler"
                >
                  {{ row.title }}
                </router-link>

              </div>
            </t-dropdown>
        </div>
    </div>

</template>

<script>
import Config from '../config/FilterCap.js'
export default {
  name: 'FilterDropdown',
  props: [],
  components:{},
  data() {
    return {
      navConfig: null

    }
  },
  created(){
      this.navConfig = Config;

  },
  methods: {}
}
</script>
