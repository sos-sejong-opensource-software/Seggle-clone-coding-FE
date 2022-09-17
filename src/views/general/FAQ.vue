<template>
  <div class="container">
    <header class="faq-header">
      <h1 id="title">FAQ</h1>
    </header>

    <div class="accordion py-3" id="accordionExample">
      <div v-for="(faq, index) in faqList"
           :key="index"
           class="accordion-item">
        <h2 class="accordion-header"
            :id="`heading${faq.id}`">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="`#collapse${faq.id}`"
            aria-expanded="false"
            :aria-controls="`collapse${faq.id}`"
          >
            Q. {{ faq.question }}
          </button>
        </h2>
        <div
          :id="`collapse${faq.id}`"
          class="accordion-collapse collapse"
          :aria-labelledby="`heading${faq.id}`"
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <span><v-md-editor :model-value="faq.answer" mode="preview"></v-md-editor></span>
            <!-- <span><VueShowdown class="v-show-down" :markdown="faq.answer" :options= "{
              emoji: true,
              tables: true,
              parseImgDimensions: true,
              omitExtraWLInCodeBlocks: true,
              simpleLineBreaks: true,
              splitAdjacentBlockquotes: true
            }"></VueShowdown></span> -->
          </div>
        </div>
      </div>
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
      faqList: []
    }
  },
  created () {
    this.getfaqList()
  },
  methods: {
    async getfaqList () {
      try {
        const res = await api.getFAQ()
        this.faqList = res.data
      } catch (error) {
        console.log(error)
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
