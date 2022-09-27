<template>
  <div class="container">
    <header class="faq-header">
      <h1 id="title">FAQ</h1>
    </header>

    <div class="accordion py-3" id="accordionExample">
          <!-- bootstrap 공식 문서의 acccordion을 참고해주세요! -->
          <!-- https://getbootstrap.com/docs/5.2/components/accordion/#how-it-works -->
    </div>
  </div>
</template>

<script>
import api from '@/api/index.js'
// import VueShowdown from 'vue-showdown'
export default {
  name: 'FAQ',
  // components: VueShowdown,
  data () {
    return {
      //
    }
  },
  created () {
    this.getfaqList()
  },
  methods: {
    async getfaqList () {
      //faq 리스트 조회
      try {
      } catch (error) {
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 3rem 3rem;
  @media (max-width: 420px) {
    padding: 1rem 1rem;
  }
}
header {
  display: flex;
  justify-content: space-between;
  padding: 3rem 0rem;
  @media (max-width: 768px) {
    display: block;
    padding: 1rem 0rem;
  }
}
.accordion-button,
.accordion-body {
  text-align: left;
  @media (max-width: 420px) {
    font-size: calc(0.5rem + 2vw);
    padding: 0.7rem;
  }
}
</style>
