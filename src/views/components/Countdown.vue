<template>
    <div class="">
        <section class="text-3xl flex justify-cewnter content-center flex-col mx-auto text-center mb-5">
            <span style="font-family: Luckiest Guy;" class="font-bold color-two text-4xl">Mint Starts</span>
        </section>
        <section class="flex text-6xl color-two justify-center content-center bg-black shadow-lg rounded-lg border-8 border-red-400" style="font-family: Russo One;">
            <div class="days mx-2 relative p-2 bg-transparent color-two rounded-md  ">
                {{ displayDays}}
                <div class="label text-sm  text-center mx-auto bottom-0 ">days</div>
            </div>
            <span class="leading-snug">:</span>

            <div class="hours mx-2 relative p-2 bg-transparent rounded-md ">
                {{ displayHours}}
                <div class="label text-sm text-center mx-auto bottom-0">hours</div>
            </div>
            <span class="leading-snug">:</span>

            <div class="minutes mx-2 relative  p-2 bg-transparent rounded-md  ">
                {{ displayMinutes}}
                <div class="label text-sm text-center mx-auto bottom-0">minutes</div>
            </div>
            <span class="leading-snug ">:</span>

            <div class="seconds mx-2 relative  p-2 bg-transparent rounded-md ">
                {{ displaySeconds}}
                <div class="label text-sm  text-center mx-auto bottom-0">seconds</div>
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
