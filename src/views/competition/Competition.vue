<template>
  <div class="container problem-container" :key="problem">
    <notifications group="message"
                 position="top center"
                 class="noti"
                 animation-name="v-fade-left"
                 :speed="50"
                 :width="250"
                 :max="3"
                 :ignoreDuplicates="true"/>
    <div class="problem-header">
      <h1 id="title">
        {{ problem.title }}
      </h1>
      <button class="btn" @click="joinCompetition" :disabled="alreadyJoined">
        {{ this.joinText }}
      </button>
    </div>

    <div class="problem-content row">
      <!-- 세로 메뉴 탭 -->
      <div class="problem-tab col-2">
        <div class="list-group" id="list-tab" role="tablist">
          <a
            class="list-group-item list-group-item-action active"
            data-bs-toggle="list"
            role="tab"
            id="list-info-list"
            href="#list-info"
            aria-controls="list-info"
            >대회 설명
          </a>
          <a
            class="list-group-item list-group-item-action"
            data-bs-toggle="list"
            role="tab"
            id="list-data-list"
            href="#list-data"
            aria-controls="list-data"
            >데이터
          </a>
          <a
            class="list-group-item list-group-item-action"
            data-bs-toggle="list"
            role="tab"
            id="list-leaderboard-list"
            href="#list-leaderboard"
            aria-controls="list-leaderboard"
            >리더보드
          </a>
          <a v-if="this.privilege !== -1"
            class="list-group-item list-group-item-action"
            data-bs-toggle="list"
            role="tab"
            id="list-submit-list"
            href="#list-submit"
            aria-controls="list-submit"
            >제출
          </a>
        </div>
      </div>
      <!-- 탭 내용 -->
      <div class="problem-tab-content col-10">
        <div class="tab-content" id="nav-tabContent">
          <!-- 문제 설명 -->
          <div
            class="tab-pane fade show active"
            role="tabpanel"
            id="list-info"
            aria-labelledby="list-info-list"
            :key="problem"
          >
            <h5 class="list-title">대회 설명</h5>
            <p class="list-content">
              <span><v-md-editor :model-value="problem.description" mode="preview"></v-md-editor></span>
              <!-- <span><VueShowdown class="v-show-down" :markdown="problem.description"></VueShowdown></span> -->
            </p>
            <div class="period">
              <h5>시작 시간</h5>
              <p>
                {{ problem.start_time }}
              </p>
              <h5>종료 시간</h5>
              <p>
                {{ problem.end_time }}
              </p>
            </div>
          </div>
          <!-- 데이터 -->
          <div
            class="tab-pane fade"
            id="list-data"
            role="tabpanel"
            aria-labelledby="list-data-list"
          >
            <h5 class="list-title">데이터 설명
              <a id="zip-download">
                <button class="btn"
                        :disabled="alreadyJoined == false"
                        @click="downloadDataFile"
                >다운로드</button>
              </a>
            </h5>
            <p class="list-content">
              <span><v-md-editor :model-value="problem.data_description" mode="preview"></v-md-editor></span>
            </p>
          </div>
          <!-- 리더보드 -->
          <div
            class="tab-pane fade table-div"
            id="list-leaderboard"
            role="tabpanel"
            aria-labelledby="list-leaderboard-list"
          >
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">이름</th>
                  <th scope="col">점수</th>
                  <th scope="col">제출 날짜</th>
                  <th v-if="IsContestAdminCheck()" scope="col">코드(.ipynb)</th>
                  <th v-if="IsContestAdminCheck()" scope="col">답안(.csv)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="IsContestAdminCheck() && leaderboardList.length === 0"><td colspan="6">아직 아무도 제출하지 않았어요.</td></tr>
                <tr v-else-if="!IsContestAdminCheck() && leaderboardList.length === 0"><td colspan="4">아직 아무도 제출하지 않았어요.</td></tr>
                <tr
                  v-for="user in leaderboardList"
                  :key="user"
                  :class="{
                    'bg-success p-2 text-dark bg-opacity-50':
                      this.userID === user.username,
                  }"
                >
                  <th v-if="user.id===0" scope="row"><font-awesome-icon icon="flag" /></th>
                  <th v-else scope="row">{{ user.id }}</th>
                  <td>{{ user.username }}</td>
                  <td>{{ user.score }}</td>
                  <td>
                    {{ user.created_time }}
                  </td>
                  <td v-if="IsContestAdminCheck()">
                    <a id="ipynb-download">
                      <button
                        class="download-btn"
                        @click="downloadIpynbFile(user.submission_id)"
                      >
                        <font-awesome-icon icon="file-arrow-down" />
                      </button>
                    </a>
                  </td>
                  <td v-if="IsContestAdminCheck()">
                    <a id="csv-download">
                      <button
                        class="download-btn"
                        @click="downloadCsvFile(user.submission_id)"
                      >
                        <font-awesome-icon icon="file-arrow-down" />
                      </button>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- 제출 -->
          <div
            class="tab-pane fade"
            id="list-submit"
            role="tabpanel"
            aria-labelledby="list-submit-list"
          >
            <div class="progress">
              <div class="progress-bar"
                   role="progressbar"
                   :style="{ width: `${percentCompleted}%` }"
                   :aria-valuenow="percentCompleted"
                   aria-valuemin="0"
                   aria-valuemax="100">{{ `${percentCompleted}%` }}</div>
            </div>
            <div class="file-submit">
              <h5 class="list-title">csv 파일 제출</h5>
              <p class="file-desc">하나의 csv 파일만 업로드 가능합니다</p>
              <input
                id="csv-file-input"
                type="file"
                class="form-control"
                accept=".csv"
                @change="uploadFile"
              />

              <h5 class="list-title">ipynb 파일 제출</h5>
              <p class="file-desc">하나의 ipynb 파일만 업로드 가능합니다</p>
              <input
                id="ipynb-file-input"
                type="file"
                class="form-control"
                accept=".ipynb"
                @change="uploadFile"
              />
              <button class="btn" @click="submitFile">파일 제출</button>
            </div>
            <div class="table-div">
              <h5 class="list-title">제출 내역</h5>
              <p class="file-desc">선택한 제출 내역이 리더보드에 표시됩니다.</p>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col"><font-awesome-icon icon="check" /></th>
                    <th scope="col">csv 파일</th>
                    <th scope="col">ipynb 파일</th>
                    <th scope="col">점수</th>
                    <th scope="col">상태</th>
                    <th scope="col">제출 날짜</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="count === 0">
                    <td colspan="6">제출 내역이 없습니다.</td>
                  </tr>
                  <tr v-for="(submit, i) in submitList" :key="i" :class="{ 'bg-secondary bg-opacity-10': submit.on_leaderboard}">
                    <th scope="row">
                        <input v-if="IsContestAdminCheck() && submit.status===0"
                        class="form-check-input"
                        type="checkbox"
                        :value="submit.id"
                        v-model="checkList"
                        :checked ="submit.on_leaderboard"
                        />
                      <input v-else-if="submit.status===0"
                        class="form-check-input"
                        type="radio"
                        :value="submit.id"
                        v-model="submitRowIndex"
                        :checked ="submit.on_leaderboard"
                      />
                    </th>
                    <td>
                      <a id="csv-download">
                        <button class="download-btn"
                          @click="downloadCsvFile(submit.id)">
                          <font-awesome-icon icon="file-arrow-down" />
                        </button>
                      </a>
                    </td>
                    <td>
                      <a id="ipynb-download">
                        <button class="download-btn"
                          @click="downloadIpynbFile(submit.id)">
                          <font-awesome-icon icon="file-arrow-down" />
                        </button>
                      </a>
                    </td>
                    <td>{{ submit.score }}</td>
                    <td>{{ submit.success }}</td>
                    <td>{{ submit.created_time }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Pagination :pagination="PageValue" @get-page="getUserSubmissions" />
            <button class="btn" @click="selectSubmission">저장</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/index.js'
import Pagination from '@/components/Pagination.vue'
import { formatTime } from '@/utils/time.js'

const Swal = require('sweetalert2')

export default {
  name: 'Competition',
  components: {
    Pagination
  },
  data () {
    return {
      userID: this.$store.state.userid,
      joinText: '참여',
      alreadyJoined: false,
      isClassUser: false,

      competitionID: this.$route.params.competitionID,

      problem: [],
      leaderboardList: [],

      submitList: [],
      checkList: [],
      submitRowIndex: '',
      csv: '',
      ipynb: '',
      uploadPercentage: 0,

      PageValue: [],
      count: 0,
      currentPage: 1,
      privilege: -1,

      percentCompleted: 0,
      animation: {
        enter: {
          opacity: [1, 0],
          translateX: [0, -300],
          scale: [1, 0.2]
        },
        leave: {
          opacity: 0,
          height: 0
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getUserStatus()
      /* 대회 참여여부 체크 */
      if (this.alreadyjoined) {
        this.joinText = '참여중'
      } else {
        this.joinText = '참여하기'
      }
      this.getProblem()
      this.getUserSubmissions(1)
      this.getLeaderboard()
    },
    /* 대회 관리자 리스트 불러오기 */
    async getUserStatus () {
      try {
        const res = await api.competitionUserPrivilege(this.competitionID)
        if (res.data.privilege >= 0) {
          this.joinText = '참여중'
          this.alreadyJoined = true
          this.privilege = res.data.privilege
        }
      } catch (err) {
        if (err.response.status === 404) {
          await Swal.fire({
            title: '잘못된 접근입니다.',
            icon: 'error',
            confirmButtonText: '확인'
          }).then((result) => {
            if (result.isConfirmed) {
              this.$router.push({
                name: 'CompetitionList'
              })
            }
          })
        }
      }
    },
    /* 대회 관리자인지 체크 */
    IsContestAdminCheck () {
      if (this.privilege === 0 || this.privilege === -1) {
        return false
      } else {
        return true
      }
    },
    isEndProblem () {
      const now = new Date()
      const time = this.problem.end_time.replace(/-/gi, '/').replace(' ', '/')
      const endTime = new Date(time)

      return endTime <= now
    },
    /* 대회문제 불러오기 */
    async getProblem () {
      try {
        const res = await api.getCompetitions(this.competitionID)
        res.data.start_time = formatTime(res.data.start_time)
        res.data.end_time = formatTime(res.data.end_time)

        this.problem = res.data
      } catch (err) {
        console.log(err)
      }
    },
    /* 리더보드 불러오기 */
    async getLeaderboard () {
      try {
        const res = await api.getCompetitionsLeaderboard(this.competitionID)
        this.leaderboardList = res.data
        for (const user of this.leaderboardList) {
          user.created_time = formatTime(user.created_time)
        }
      } catch (err) {
        console.log(err)
      }
    },
    /* 대회 참여하기 */
    async joinCompetition () {
      try {
        await api.joinCompetition(this.competitionID)
        Swal.fire({
          title: '참여 완료되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
          customClass: {
            actions: 'my-actions',
            confirmButton: 'order-2'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.go(this.$router.currentRoute)
          }
        })
      } catch (err) {
        Swal.fire(
          {
            title: `${err.response.data.error}`,
            icon: 'error',
            confirmButtonText: '확인'
          }
        )
        // alert(err.response.data.error)
      }
    },
    /* 대회참여자의 제출물 불러오기 */
    async getUserSubmissions (page) {
      try {
        this.currentPage = page
        this.PageValue = []
        const res = await api.getUserCompetitionSubmissions(
          page,
          this.competitionID,
          this.userID
        )
        this.count = res.data.length
        this.submitList = res.data.results
        for (const submit of this.submitList) {
          submit.created_time = formatTime(submit.created_time)
          if (submit.status === 1) {
            submit.success = '파일 오류'
          } else {
            submit.success = '정상 제출'
          }
        }
        this.PageValue.push({
          count: res.data.count,
          currentPage: this.currentPage
        })

        if (res.data.count !== 0) {
          this.total = parseInt((res.data.count - 1) / 15) + 1
        }
      } catch (err) {
        console.log(err)
      }
    },
    /* 파일 제출 */
    async submitFile ({ commit }) {
      try {
        if (this.privilege !== -1) {
          if (this.csv === '') {
            this.$notify({
              group: 'message',
              title: 'csv 파일을 제출해주세요.',
              type: 'warn'
            })
          } else if (this.ipynb === '') {
            this.$notify({
              group: 'message',
              title: 'ipynb 파일을 제출3해주세요.',
              type: 'warn'
            })
          } else {
            if (this.isEndProblem()) {
              this.$notify({
                group: 'message',
                title: '제출 시간이 지났습니다.',
                type: 'error'
              })
              // this.$router.push(this.$router.currentRoute)
              return
            }
            const formData = new FormData()
            formData.append('csv', this.csv)
            formData.append('ipynb', this.ipynb)

            const formDataInstance = api.createInstance(true)
            formDataInstance.post(`/api/competitions/${this.competitionID}/submission/`, formData, {
              onUploadProgress: (progressEvent) => {
                const percentage = (progressEvent.loaded * 100) / progressEvent.total
                this.percentCompleted = Math.round(percentage)
              }
            }).then((result) => {
              if (result.data.success === '성공했습니다' && this.percentCompleted === 100) {
                Swal.fire({
                  title: '파일 제출이 완료되었습니다.',
                  icon: 'success',
                  confirmButtonText: '확인',
                  customClass: {
                    actions: 'my-actions',
                    confirmButton: 'order-2'
                  }
                })
                document.getElementById('csv-file-input').value = ''
                document.getElementById('ipynb-file-input').value = ''
                this.csv = ''
                this.ipynb = ''
                this.getUserSubmissions(1)
              }
            }).catch((err) => {
              if (err.response.status === 400) {
                if (err.response.data.title !== undefined) {
                  this.$notify({
                    group: 'message',
                    title: `${err.response.data.title}`,
                    type: 'error'
                  })
                }
                if (err.response.data.error !== undefined) {
                  this.$notify({
                    group: 'message',
                    title: `${err.response.data.error}`,
                    type: 'error'
                  })
                }
              }
            })
          }
        } else {
          this.$notify({
            group: 'message',
            title: '대회를 참가한 후 제출해주시기 바랍니다.',
            type: 'error'
          })
        }
      } catch (err) {
      }
    },
    /* 파일 업로드 */
    uploadFile (e) {
      const files = e.target.files || e.dataTransfer.files
      const id = e.target.id

      const fileSize = files[0].size
      const csvMaxSize = 25 * 1024 * 1024
      const ipynbMaxSize = 50 * 1024 * 1024
      if (id === 'csv-file-input') {
        if (fileSize > csvMaxSize) {
          this.$notify({
            group: 'message',
            title: '첨부파일은 25MB 이내로 등록 가능합니다.',
            type: 'error'
          })
          e.target.value = ''
        } else {
          this.csv = files[0]
        }
      } else {
        if (fileSize > ipynbMaxSize) {
          this.$notify({
            group: 'message',
            title: '첨부파일은 50MB 이내로 등록 가능합니다.',
            type: 'error'
          })
          e.target.value = ''
        }
        this.ipynb = files[0]
      }
    },
    /* 제출할 파일 선택 */
    async selectSubmission () {
      const selectedSubmission = []
      if (this.privilege > 0) {
        for (const checkedSubmission of this.checkList) {
          const item = {}
          const id = parseInt(checkedSubmission)
          item.id = id
          selectedSubmission.push(item)
        }
      } else {
        const item = {}
        const id = parseInt(this.submitRowIndex)
        item.id = id
        selectedSubmission.push(item)
      }
      try {
        await api.selectCompetitionSubmission(this.competitionID, selectedSubmission)
        Swal.fire({
          title: '제출이 완료되었습니다. 리더보드를 확인해주세요.',
          icon: 'success',
          confirmButtonText: '확인',
          customClass: {
            actions: 'my-actions',
            confirmButton: 'order-2'
          }
        })
        this.getLeaderboard()
        console.log(this.leaderboardList)
      } catch (err) {
        console.log(err)
      }
    },
    downloadFile (response, FILE_TYPE) {
      const filename = response.headers['content-disposition'].split('filename*=UTF-8\'\'')[1]
      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: `application/${FILE_TYPE}`
        })
      )
      const a = document.getElementById(`${FILE_TYPE}-download`)
      a.href = url
      a.download = decodeURI(filename)
      a.click()
    },
    async downloadDataFile () {
      const response = await api.downloadDataFile(this.problem.problem_id)
      this.downloadFile(response, 'zip')
    },
    async downloadCsvFile (submissionID) {
      const response = await api.downloadCompetitionCsvFile(submissionID)
      this.downloadFile(response, 'csv')
    },
    async downloadIpynbFile (submissionID) {
      const response = await api.downloadCompetitionIpynbFile(submissionID)
      this.downloadFile(response, 'ipynb')
    }
  }
}
</script>

<style lang="scss" scoped>
.table-div {
  .table {
    tbody {
      tr:hover {
        cursor: default;
      }
    }
  }
}

.block {
  display: flex;
}

.noti {
  padding-top: 100px;
}
</style>
