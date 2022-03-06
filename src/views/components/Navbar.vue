<template>
  <div data-collapse="small" data-animation="default" data-duration="400" class="navbar w-nav">
    <div class="bg-gray-300">
    <div class=" mx-auto">

        <div class="flex flex-row">
            <div class=" md:flex-1 flex-none ">
                <router-link to="/" class='color-four font-bold text-3xl no-underline p-6 py-10 my-10'>
                    DYSTOSKULLS
                </router-link>
            </div>

            <div class="sm:flex-grow">
            </div>

            <div class="lg:flex-none flex-1">
                    <div class="flex row justify-end">
                        <UpperNav
                           />
                    </div>
            </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>


<script>
import UpperNav from './UpperNav.vue';
import AccordionNav from './AccordionNav.vue';
export default {
  name: 'Navbar',
  props: [],
  components: {UpperNav,AccordionNav},
  data() {
    return {
      showResponsiveMenu: false,
    }
  },
  methods: {
  }
}
</script>
