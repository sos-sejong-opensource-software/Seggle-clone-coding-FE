<template>
  <nav aria-label="Page navigation">
  <ul class="pagination">
    <li class="page-item disabled" v-if="currentPage==1">
      <a class="page-link" aria-label="Previous" aria-disabled="true">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item" v-else>
      <a class="page-link" aria-label="Previous" @click="getPage(currentPage-1)">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <div v-for="page in total" :key="page">
      <li class="page-item active" v-if="page==currentPage"><a class="page-link">{{ page }}</a></li>
      <li class="page-item" v-else><a class="page-link" @click="getPage(page)">{{ page }}</a></li>
    </div>
    <li class="page-item disabled" v-if="currentPage==total">
      <a class="page-link" aria-label="Next" aria-disabled="true">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
    <li class="page-item" v-else>
      <a class="page-link" aria-label="Next" @click="getPage(currentPage+1)">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    pagination: {}
  },
  data () {
    return {
      currentPage: 1,
      total: 0
    }
  },
  methods: {
    computePage () {
      if (this.pagination[0]) {
        if (this.pagination[0].count !== 0) {
          this.total = parseInt((this.pagination[0].count - 1) / 15) + 1
        }
        this.currentPage = this.pagination[0].currentPage
      }
    },
    getPage (page) {
      this.$emit('get-page', page)
    }
  },
  watch: {
    pagination: {
      deep: true,
      handler () {
        this.computePage()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
nav {
  display: inline-block;
  a {
    color: black;
    cursor: pointer;
    @media (max-width: 420px) {
    font-size: calc(0.5rem + 2vw);
  }
  }
  a:hover {
    color: black;
  }
  li.page-item.active {
    a.page-link {
      background-color: #0e1b49;
      border-color: #0e1b49;
    }
  }
}
</style>
