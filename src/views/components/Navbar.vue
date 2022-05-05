<template>
  <div data-collapse="small" data-animation="default" data-duration="400" class="navbar w-nav">
    <div class="bg-three">
    <div class=" mx-auto">
        <div class="flex flex-row p-0">
            <div class=" md:flex-1 flex-1 text-center md:text-left" style="font-family: Prompt">
                <router-link to="/" class='no-underline' >
                  <div class="color-four font-bold text-3xl lg:text-5xl tracking-wider pl-4 lg:pl-6 px-2 my-4  lg:my-2">
                      <span style="font-family: Luckiest Guy">Vibers</span >
                  </div>
                </router-link>
            </div>

            <div class="flex-grow">
            </div>

            <div class="lg:flex-none flex-1">
                    <div class="justify-end">
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
