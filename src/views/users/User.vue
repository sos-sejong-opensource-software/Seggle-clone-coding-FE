<template>
  <div class="container">
    <div class="header">
      <h1 id="title">{{ this.$store.state.userid }}님, 반갑습니다!</h1>
      <div class="button-group">
        <button class="btn btn-primary" type="button" @click="goResign">
          회원탈퇴
        </button>
        <button class="btn btn-primary" type="button" @click="goResetPW">
          비밀번호 변경
        </button>
      </div>
    </div>
    <table class="table py-3">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">대회 제목</th>
          <th scope="col">시작 날짜</th>
          <th scope="col"></th>
          <th scope="col">마감 날짜</th>
          <th scope="col">등수</th>
        </tr>
      </thead>
      <tbody>
            <tr v-if="count===0"><td colspan="6">참가한 대회가 없습니다.</td></tr>

        <tr
          v-for="problem in problemList"
          :key="problem"
          @click="goProblem(problem.id)"
        >
          <td>{{ problemList.id}}</td>
          <td>{{ problem.title }}</td>
          <td>{{ problem.start_time }}</td>
          <td>{{ problem.dday }}</td>
          <td>{{ problem.end_time }}</td>
          <td>{{ problem.rank }}/{{ problem.user_total }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="container-sm px-5 py-5">
    <calendar-heatmap class="v-heatmap" :values="heatmapValues" :end-date="endDate" />
  </div>
</template>
<script>
import api from '@/api/index.js'
import 'vue-calendar-heatmap'
export default {
  name: 'User',
  data: () => {
    return {
      problemList: [],
      heatmapValues: [],
      d_day: [],
      endDate: '2022-11-21',
      count: 0
    }
  },
  created () {
    this.showUserCompetition()
    this.showUserHeatmap()
    this.setTodayDate()
  },
  methods: {
    setTodayDate () {
      let date = new Date().toISOString()
      date = date.slice(0, 10)
      this.endDate = date
    },
    goResign () {
      this.$router.push({
        name: 'Resign'
      })
    },
    goResetPW () {
      this.$router.push({
        name: 'ResetPassword'
      })
    },
    async showUserCompetition () {
      const username = this.$store.state.userid
      try {
        const res = await api.showUserCompetition(username)
        this.problemList = res.data
        this.count = this.problemList.length
        this.problemList = this.problemList.reverse()

        this.setTime()
        this.problemList.sort((a, b) => {
          if (a.start_end < b.start_end) return 1
          else if (a.start_end > b.start_end) return -1
        })
        this.problemList.sort((a, b) => {
          if ((a.start_end >= 0) & (b.start_end >= 0)) {
            if (a.diffDay > b.diffDay) return 1
            else if (a.diffDay < b.diffDay) return -1
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    async showUserHeatmap () {
      const username = this.$store.state.userid

      try {
        const res = await api.showUserHeatmap(username)
        this.heatmapValues = res.data
      } catch (error) {
        console.log(error)
      }
    },
    setTime () {
      for (let i = 0; i < this.problemList.length; i++) {
        const startTime = this.problemList[i].start_time.substring(0, 10)
        const endTime = this.problemList[i].end_time.substring(0, 10)
        this.problemList[i].start_time = startTime
        this.problemList[i].end_time = endTime
        // D-Day 설정
        const startDate = new Date(startTime.replace(/-/g, '/'))
        const endDate = new Date(endTime.replace(/-/g, '/'))
        const today = new Date()
        endDate.setHours(23, 59, 59, 0)
        today.setHours(0, 0, 0, 0)
        let starttoend = endDate.getTime() - startDate.getTime()
        starttoend = Math.floor(starttoend / (1000 * 60 * 60 * 24)) + 1
        if (startDate > today) {
          let interval = startDate.getTime() - today.getTime()
          interval = Math.floor(interval / (1000 * 60 * 60 * 24))
          this.problemList[i].dday = 'OPEN D - ' + interval
          this.problemList[i].start_end = -1
          this.problemList[i].diffDay = -1
        } else if ((startDate <= today) & (endDate >= today)) {
          this.problemList[i].start_end = starttoend
          let interval = endDate.getTime() - today.getTime()
          interval = Math.floor(interval / (1000 * 60 * 60 * 24))
          if (interval === 0) {
            this.problemList[i].dday = 'D - Day'
            this.problemList[i].diffDay = 0
          } else {
            this.problemList[i].dday = 'D - ' + interval
            this.problemList[i].diffDay = interval
          }
        } else {
          this.problemList[i].start_end = -2
          this.problemList[i].dday = '종료'
          this.problemList[i].diffDay = -1
        }
      }
    },
    goProblem (problemID) {
      this.$router.push({
        name: 'Competition',
        params: { competitionID: problemID }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 3rem 0rem;

  h1 {
    margin-bottom: 0;
    font-weight: bold;
  }
}

.map {
  background-color: gainsboro;
}
</style>
