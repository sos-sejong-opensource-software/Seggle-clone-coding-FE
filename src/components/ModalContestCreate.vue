<template>
  <transition name="modal" data-backdrop="static">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <form class="modal-container" @submit.prevent="submitForm">
          <div class="modal-header">
            <h5>{{ this.modalHeader }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="$emit('close')"
            ></button>
          </div>

          <div class="modal-body">
            <div class="row list-name">
              <label class="form-label">과제 및 시험 목록</label>
              <input
                class="form-control"
                type="text"
                v-model="contestInfo.title"
                placeholder="과제 및 시험명"
                required
              />
            </div>
            <div class="row">
              <div class="col-6 start-time" data-backdrop="static">
                <label class="form-label">시작시간</label>
                <Datepicker class="v-datepicker"
                  v-model="contestInfo.startTime"
                  placeholder="시작 시간"
                  textInput
                />
              </div>
              <div class="col-6 end-time" data-backdrop="static">
                <label class="form-label">종료시간</label>
                <Datepicker class="v-datepicker"
                  v-model="contestInfo.endTime"
                  placeholder="종료 시간"
                  textInput
                />
              </div>
              <div class="row exam-checkbox">
                <div class="col-6">
                  <label style="float: left">시험모드</label>
                  <span
                    class="form-check form-switch"
                    style="float: left; margin-left: 10px"
                  >
                    <input
                      class="form-check-input"
                      id="flexSwitchCheckChecked"
                      type="checkbox"
                      v-model="contestInfo.checkedExam"
                      checked
                    />
                  </span>
                </div>
                <div class="col-6">
                  <label style="float: left">공개</label>
                  <span
                    class="form-check form-switch"
                    style="float: left; margin-left: 10px"
                  >
                    <input
                      class="form-check-input"
                      id="flexSwitchCheckChecked"
                      type="checkbox"
                      v-model="contestInfo.checkedVisible"
                      checked
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn" type="submit">저장</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import api from '@/api/index.js'
import { UTCtoKST } from '@/utils/time.js'
const Swal = require('sweetalert2')

export default {
  name: 'ModalContestCreate',
  props: {
    editContestInfo: Object,
    mode: String
  },
  data () {
    return {
      classID: this.$route.params.classID,
      contestInfo: {
        id: '',
        title: '',
        startTime: '',
        endTime: '',
        checkedExam: false,
        checkedVisible: true
      },
      modalHeader: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.mode === 'create') {
        this.modalHeader = '과제 및 시험 목록 생성'
      } else if (this.mode === 'edit') {
        this.modalHeader = '과제 및 시험 목록 편집'
        this.contestInfo.id = this.editContestInfo.id
        this.contestInfo.title = this.editContestInfo.name
        this.contestInfo.startTime = this.editContestInfo.start_time
        this.contestInfo.endTime = this.editContestInfo.end_time
        this.contestInfo.checkedExam = this.editContestInfo.is_exam
        this.contestInfo.checkedVisible = this.editContestInfo.visible
      }
    },
    async submitForm () {
      try {
        const data = {
          name: this.contestInfo.title,
          start_time: UTCtoKST(this.contestInfo.startTime),
          end_time: UTCtoKST(this.contestInfo.endTime),
          is_exam: this.contestInfo.checkedExam,
          visible: this.contestInfo.checkedVisible
        }
        if (this.mode === 'create') {
          await api.createContest(this.classID, data)
        } else if (this.mode === 'edit') {
          await api.editContest(this.classID, this.contestInfo.id, data)
        }
        Swal.fire({
          title: `${this.contestInfo.title}이(가) 등록되었습니다.`,
          icon: 'success',
          confirmButtonText: '확인',
          customClass: {
            actions: 'my-actions',
            confirmButton: 'order-2'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.go({
              name: 'ClassContest',
              params: {
                classID: this.classID
              }
            })
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  watch: {
    'contestInfo.endTime' () {
      const date = new Date()
      if (this.contestInfo.endTime !== '') {
        if (date > this.contestInfo.endTime || this.contestInfo.startTime > this.contestInfo.endTime) {
          // this.$notify({
          //   group: 'message',
          //   title: '종료 시간을 다시 설정해주세요.',
          //   type: 'warn'
          // })
          alert('종료 시간을 다시 설정해주세요.')
          this.contestInfo.endTime = ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.start-time,
.end-time {
  padding: 0;
  @media (max-width: 420px) {
    width: 100%;
    margin-bottom: 10px;
  }
}

.exam-checkbox {
  padding: 1rem;
}
</style>
