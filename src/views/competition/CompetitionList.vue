<template>
  <div class="container">
    <header>
      <h1 id="title">일반 대회</h1>
      <div v-if="this.$store.getters.isAdmin">
        <button class="btn" @click="goEditCompetitionList">대회 관리</button>
        <button class="btn" @click="goCreateCompetitionProblem">
          대회 생성
        </button>
      </div>
    </header>

    <div class="table-div">
      <table class="table">
        <thead>
          <tr>
            <!-- <th scope="col" class="col-1">#</th> -->
            <th scope="col" class="col-3">대회 제목</th>
            <th scope="col" class="col-2"></th>
            <th scope="col" class="col-2">시작날짜</th>
            <th scope="col" class="col-2"></th>
            <th scope="col" class="col-2">마감날짜</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="count === 0">
            <td colspan="5">등록된 대회가 없습니다.</td>
          </tr>
          <tr
            v-for="problem in problemList"
            :key="problem"
            @click="goProblem(problem.id)"
          >
            <td class="col-3">{{ problem.problem.title }}</td>
            <td>{{ problem.dday }}</td>
            <td>{{ problem.start_time }}</td>
            <td>
              <div class="progress">
                <div
                  class="progress-bar"
                  :class="problem.progressBar.type"
                  role="progressbar"
                  :style="{
                    width: problem.progressBar.value + '%',
                  }"
                  :aria-valuenow="problem.progressBar.value"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </td>
            <td>{{ problem.end_time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from '@/api/index.js'

export default {
  name: 'CompetitionList',
  data () {
    return {
      problemList: [],
      showModal: false,
      count: 0
    }
  },
  mounted () {
    this.getCompetitionList()
  },
  methods: {
    /* 일반대회 리스트 불러오기 */
    async getCompetitionList () {
      try {
        const res = await api.getCompetitionList()
        this.count = res.data.length
        this.problemList = res.data.reverse()
        this.setTime()
        this.setProgressBar()
        /* 시작~종료 시간 차이가 작은 순서대로 정렬 */
        this.problemList.sort((a, b) => {
          if (a.start_end < b.start_end) return 1
          else if (a.start_end > b.start_end) return -1
        })
        /* 다시 디데이(종료-현재시간)가 큰 순서대로 정렬(진행중인 대회만) */
        this.problemList.sort((a, b) => {
          if (a.start_end >= 0 && b.start_end >= 0) {
            if (a.diffDay > b.diffDay) return 1
            else if (a.diffDay < b.diffDay) return -1
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    /* dday(문자열), diffday(디데이) 설정하기 */
    setTime () {
      for (const problem of this.problemList) {
        const startTime = problem.start_time.substring(0, 10)
        const endTime = problem.end_time.substring(0, 10)
        problem.start_time = startTime
        problem.end_time = endTime
        // D-Day 설정
        const startDate = new Date(startTime.replace(/-/g, '/'))
        const endDate = new Date(endTime.replace(/-/g, '/'))
        const today = new Date()
        endDate.setHours(23, 59, 59, 0)
        today.setHours(0, 0, 0, 0)
        let startToEnd = endDate.getTime() - startDate.getTime()
        startToEnd = Math.floor(startToEnd / (1000 * 60 * 60 * 24)) + 1
        /* 시작날짜가 오늘 이후인 경우 */
        if (startDate > today) {
          let interval = startDate.getTime() - today.getTime()
          interval = Math.floor(interval / (1000 * 60 * 60 * 24))
          problem.dday = 'OPEN D - ' + interval // dday에는 문자열 저장
          problem.start_end = -1
          problem.diffDay = -1
        } else if ((startDate <= today) & (endDate >= today)) {
          // 시작 날짜가 오늘인 경우
          problem.start_end = startToEnd
          let interval = endDate.getTime() - today.getTime()
          interval = Math.floor(interval / (1000 * 60 * 60 * 24))
          if (interval === 0) {
            problem.dday = 'D - Day'
            problem.diffDay = 0
          } else {
            problem.dday = 'D - ' + interval
            problem.diffDay = interval
          }
        } else {
          problem.start_end = -2
          problem.dday = '종료'
          problem.diffDay = -1
        }
      }
    },
    /* Progress Bar 만들기 */
    setProgressBar () {
      for (const problem of this.problemList) {
        const progress = {}
        if (problem.start_end === -1) {
          progress.value = 0
          progress.type = 'bg-secondary'
        } else if (problem.start_end === -2) {
          progress.value = 100
          progress.type = 'bg-secondary'
        } else {
          progress.value = 100 - (problem.diffDay / problem.start_end) * 100
          if (progress.value <= 50) {
            progress.type = 'bg-info'
          } else if (progress.value <= 70) {
            progress.type = 'bg-warning'
          } else if (progress.value === 100) {
            progress.type = 'bg-success'
          } else {
            progress.type = 'bg-danger'
          }
        }
        problem.progressBar = progress
      }
    },
    /* 대회문제 생성 */
    goCreateCompetitionProblem () {
      this.$router.push({
        name: 'CreateCompetition'
      })
    },
    /* 대회문제 상세보기 */
    goProblem (problemID) {
      this.$router.push({
        name: 'Competition',
        params: { competitionID: problemID }
      })
    },
    goEditCompetitionList () {
      this.$router.push({
        name: 'EditCompetitionList'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  padding: 3rem 3rem;
  @media (max-width: 420px) {
    padding: 1rem 1rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    padding: 3rem 0rem;
    @media (max-width: 768px) {
      display: block;
    }
  }

  .btn {
    @media (max-width: 420px) {
      font-size: 14px;
    }
  }
}
</style>
