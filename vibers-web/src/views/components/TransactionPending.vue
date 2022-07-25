<template>
    <div class="fixed bottom-0 right-0 mr-2 mb-2 text-center container shadow-md bg-four rounded-xl mx-auto max-w-xs z-50" style="border: 2px solid #B3FFC6">
      <div class="flex text-md md:text-lg lg:text-xl font-heading text-white  py-2 px-2 ">
         <div class="flex-none">
             <img
             src="@/assets/gifs/rolling.gif"
             alt="waiting for transaction"
             class="w-20 p-2"/>
         </div>
         <div class="flex-1 my-2 text-left">
             <span class="color-six">Transaction Pending</span> <br>
             {{ displayMinutes}}:{{ displaySeconds}}
         </div>
      </div>
    </div>
</template>
<script>



export default {
  name: 'Transaction Pending',
  props: [],
  data() {
      return {
          displayMinutes: 0,
          displaySeconds: 0,
      }
  },

  computed: {
      getSaleReleaseDate() {
          return this.$store.getters.getSaleReleaseDate
      },

      _seconds: () => 1000,
      _minutes(){
          return this._seconds * 60;
      },

  },

  mounted() {
      this.showRemaining()
  },

  methods: {

      formatNum: num => (num < 10 ? "0" + num : num),

      showRemaining() {
          let distance = 1000;
          const timer = setInterval(() => {
              distance = distance + 1000


              if(distance > 300000){
                  clearInterval(timer); // End Timer
                  return
              }

              const minutes = Math.floor((distance) / this._minutes);
              const seconds = Math.floor((distance % this._minutes) / this._seconds);
              this.displayMinutes = minutes;
              this.displaySeconds = this.formatNum(seconds);

          }, 1000);
      },

  }
}
</script>
