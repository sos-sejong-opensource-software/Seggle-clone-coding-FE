<template>
  <div class="container problem-container" :key="problem">
    <div class="problem-header">
      <h1 id="title">
        {{ problem.title}}
      </h1>
    </div>

    <div class="problem-content row">
      <!-- 세로 메뉴 탭 -->
      <div class="problem-tab col-2">
        <div class="list-group" id="list-tab" role="tablist">
          <a class="list-group-item list-group-item-action active"
            data-bs-toggle="list" role="tab"
            id="list-info-list"
            href="#list-info"
            aria-controls="list-info">문제 설명
          </a>
          <a class="list-group-item list-group-item-action"
            data-bs-toggle="list" role="tab"
            id="list-data-list"
            href="#list-data"
            aria-controls="list-data">데이터
          </a>
        </div>
      </div>
      <!-- 탭 내용 -->
      <div class="problem-tab-content col-10">
        <div class="tab-content" id="nav-tabContent">
        <!-- 문제 설명 -->
          <div class="tab-pane fade show active" role="tabpanel"
                id="list-info" aria-labelledby="list-info-list"
                :key="problem">
            <h5 class="list-title">
              문제 설명
            </h5>
            <p class="list-content">
              <span><v-md-editor :model-value="problem.description" mode="preview"></v-md-editor></span>
              <!-- <span><VueShowdown class="v-show-down" :markdown="problem.description"></VueShowdown></span> -->
            </p>
          </div>
        <!-- 데이터 -->
          <div class="tab-pane fade" id="list-data" role="tabpanel" aria-labelledby="list-data-list">
            <h5 class="list-title">데이터 설명
              <a id="data-download">
              <button class="btn"
                      @click="downloadDataFile">
                다운로드
              </button>
              </a>
            </h5>
            <p class="list-content">
              <span><v-md-editor :model-value="problem.data_description" mode="preview"></v-md-editor></span>
              <!-- <span><VueShowdown class="v-show-down" :markdown="problem.data_description"></VueShowdown></span> -->
            </p>
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
  name: 'AdminProblemDetail',
  // components: VueShowdown,
  data () {
    return {
      problemID: this.$route.params.problemID,
      problem: [],
      dataLink: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getProblem()
    },
    async getProblem () {
      try {
        const res = await api.getProblem(this.problemID)
        this.problem = res.data
      } catch (err) {
        console.log(err)
      }
    },
    download (url) {
      location.href = url
    },
    async downloadDataFile () {
      const response = await api.downloadDataFile(this.problemID)

      const filename = response.headers['content-disposition'].split('filename*=UTF-8\'\'')[1]
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: 'application/zip'
        })
      )
      const a = document.getElementById('data-download')
      a.download = decodeURI(filename)
      a.href = url
      a.click()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
