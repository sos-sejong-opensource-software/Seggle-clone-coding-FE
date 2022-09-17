<template>
  <div class="container problem-container">
    <form class="problem-form" @submit.prevent="submitForm">
      <div class="problem-header">
        <input type="text"
              class="form-control"
              v-model="problem.title"
              :placeholder="this.placeholder"
              required>
        <div class="button">
          <button class="btn"
                  type="submit"
          >저장</button>
        </div>
      </div>

      <div class="progress">
        <div class="progress-bar"
              role="progressbar"
              :style="{ width: `${percentCompleted}%` }"
              :aria-valuenow="percentCompleted"
              aria-valuemin="0"
              aria-valuemax="100">{{ `${percentCompleted}%` }}</div>
      </div>

      <div class="problem-content row">
      <!-- 세로 메뉴 탭 -->
        <div class="problem-tab col-2">
          <div class="list-group" id="list-tab" role="tablist">
            <a class="list-group-item list-group-item-action active"
              data-bs-toggle="list" role="tab"
              id="list-info-list"
              href="#list-info"
              aria-controls="list-info">문제 설명</a>
            <a class="list-group-item list-group-item-action"
              data-bs-toggle="list" role="tab"
              id="list-data-list"
              href="#list-data"
              aria-controls="list-data">데이터</a>
          </div>
        </div>
        <!-- 탭 내용 -->
        <div class="problem-tab-content col-10">
          <div class="tab-content" id="nav-tabContent">
            <!-- 문제 설명 -->
            <div class="tab-pane fade show active"
                  role="tabpanel"
                  id="list-info"
                  aria-labelledby="list-info-list"
                  :key="problem">
              <h5 class="list-title">문제 설명</h5>
              <v-md-editor v-model="problem.description" height="400px" placeholder="문제 설명을 입력하세요."/>
              <div class="form-option">
                <div class="form-metrics col-3">
                  <label class="form-label">평가 지표</label>
                  <select class="form-select" v-model="problem.evaluation" required>
                    <option disabled value="">평가 지표</option>
                    <option v-for="item in problem.metrics" :key="item">{{ item }}</option>
                  </select>
                </div>
              </div>
            </div>
            <!-- 데이터 -->
            <div class="tab-pane fade" id="list-data" role="tabpanel" aria-labelledby="list-data-list" :key="problem">
              <h5 class="list-title">데이터 설명</h5>
              <v-md-editor v-model="problem.data_description" height="400px" placeholder="데이터 설명을 입력하세요."/>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import api from '@/api/index.js'
const Swal = require('sweetalert2')

export default {
  name: 'EditClassContestProblem',
  data () {
    return {
      classID: this.$route.params.classID,
      contestID: this.$route.params.contestID,
      contestProblemID: this.$route.params.contestProblemID,
      problem: {
        title: '',
        description: '',
        metrics: [
          'CategorizationAccuracy',
          'RMSE',
          'MAE',
          'MSE',
          'F1-score',
          'Log-loss',
          'RMSLE',
          'mAP'
        ],
        evaluation: '',
        data_description: ''
      },
      placeholder: '',
      percentCompleted: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getContestProblem()
      this.placeholder = this.problem.title
    },
    async getContestProblem () {
      try {
        const res = await api.getContestProblem(this.classID, this.contestID, this.contestProblemID)
        Object.assign(this.problem, res.data)
      } catch (err) {
        console.log(err)
      }
    },
    async submitForm () {
      try {
        const data = {
          title: this.problem.title,
          description: this.problem.description,
          evaluation: this.problem.evaluation,
          data_description: this.problem.data_description
        }

        const instance = api.createInstance(false)
        instance.patch(`/api/class/${this.classID}/contests/${this.contestID}/${this.contestProblemID}/description/`, data, {
          onUploadProgress: (progressEvent) => {
            const percentage = (progressEvent.loaded * 100) / progressEvent.total
            this.percentCompleted = Math.round(percentage)
          }
        })
        // await api.editContestProblem(this.classID, this.contestID, this.contestProblemID, data)
        Swal.fire(
          {
            title: '저장이 완료되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
          }
        ).then((result) => {
          if (result.isConfirmed) {
            this.$router.push({
              name: 'ClassContestProblemList',
              params: {
                contestID: this.contestID
              }
            })
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
