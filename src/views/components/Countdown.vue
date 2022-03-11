<template>
    <div class="relative mb-12 lg:mb-24 ">
      <img
      src="@/assets/images/vibers/SkullGiff.gif"
      alt="Three Cosmic Cap Mushrooms"
      class="mx-auto lg:max-w-sm rounded-lg shadow-sm p-0"/>
        <!-- <section class="text-lg lg:text-3xl flex justify-cewnter content-center flex-col mx-auto text-center mb-5">
            <span style="font-family: Luckiest Guy;" class="font-bold color-two text-4xl">Mint Startasds</span>
        </section> -->
        <section class="counter relative flex text-3xl lg:text-6xl color-six justify-center content-center bg-four shadow-xl rounded-lg border-4 lg:border-8" style="border-color: #A9ECE3; font-family: Russo One;">
            <div class="absolute left-0" >
              <img
              src="@/assets/images/vibers/static.gif"
              alt="Three Cosmic Cap Mushrooms"
              style="height: 132px; width: 600px;"
              class="mx-auto rounded-lg shadow-sm p-0 hidden"/>
            </div>

            <div class="days mx-2 relative p-1 lg:p-2 bg-transparent rounded-md  ">
                {{ displayDays}}
                <div class="label text-sm lg:text-sm  text-center mx-auto bottom-0 ">days</div>
            </div>
            <span class="leading-snug">:</span>

            <div class="hours mx-2 relative p-1 lg:p-2 bg-transparent rounded-md ">
                {{ displayHours}}
                <div class="label text-sm lg:text-sm text-center mx-auto bottom-0 hide">hours</div>
                <div class="label text-sm lg:text-sm  text-center mx-auto bottom-0 unhide">hrs</div>
            </div>
            <span class="leading-snug">:</span>

            <div class="minutes mx-2 relative  p-1 lg:p-2 bg-transparent rounded-md  ">
                {{ displayMinutes}}
                <div class="label text-sm lg:text-sm text-center mx-auto bottom-0 hide">minutes</div>
                <div class="label text-sm lg:text-sm  text-center mx-auto bottom-0 unhide">min</div>
            </div>
            <span class="leading-snug ">:</span>

            <div class="seconds mx-2 relative  p-1 lg:p-2 bg-transparent rounded-md ">
                {{ displaySeconds}}
                <div class="label text-sm lg:text-sm  text-center mx-auto bottom-0 hide">seconds</div>
                <div class="label text-sm lg:text-sm  text-center mx-auto bottom-0 unhide">sec</div>
            </div>
        </section>

    </div>
</template>
<script>

export default {
  name: 'Countdown',
  props: ['endDate'],
  data() {


    return {
        displayDays: 0,
        displayHours: 0,
        displayMinutes: 0,
        displaySeconds: 0,
    }
  },
  created(){

  },
  computed: {
      _seconds: () => 1000,
      _minutes(){
          return this._seconds * 60;
      },
      _hours() {
          return this._minutes * 60;
      },
      _days() {
          return this._hours * 24;
      }
  },
  mounted() {
    this.showRemaining()
  },
  methods: {

      formatNum: num => (num < 10 ? "0" + num : num),

      showRemaining() {
          const timer = setInterval(() => {
              const now = new Date();
              const end = this.endDate;
              const distance = end.getTime() - now.getTime();

              if(distance < 0){
                  clearInterval(timer); // End Timer
                  return
              }

              const days = Math.floor((distance / this._days))
              const hours = Math.floor((distance % this._days) / this._hours);
              const minutes = Math.floor((distance % this._hours) / this._minutes);
              const seconds = Math.floor((distance % this._minutes) / this._seconds);
              this.displayMinutes = this.formatNum(minutes);
              this.displaySeconds = this.formatNum(seconds);
              this.displayHours = this.formatNum(hours);
              this.displayDays = this.formatNum(days);

          }, 1000);
      },
    },

  }
</script>
