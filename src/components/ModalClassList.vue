<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <form class="modal-container" @submit.prevent="submitForm">

          <div class="modal-header">
            <h5>{{ mode }}</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>

          <div class="modal-body">
            <div class="row">
              <div class="col-5">
                <label class="form-label">연도</label>
                <select class="form-select" disabled>
                  <option>{{ this.classYear }}</option>
                </select>
              </div>
              <div class="col-5">
                <label class="form-label">학기</label>
                <select class="form-select" v-model="classSemester" required>
                  <option disabled value="">선택</option>
                  <option v-for="option in semesterOption" :key="option">{{ option.name }}</option>
                </select>
              </div>
            </div>

            <div class="row">
              <label class="form-label">수업명(시험명)</label>
              <input class="form-control"
                    type="text"
                    v-model="classTitle"
                    :placeholder="placeholder"
                    required>
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
const Swal = require('sweetalert2')

export default {
  name: 'ModalClassList',
  props: {
    mode: String,
    classID: Number,
    semester: Number,
    title: String
  },
  data () {
    return {
      classYear: '',
      semesterOption: [
        { name: 1 },
        { name: 2 }
      ],
      classSemester: '',
      classTitle: '',
      placeholder: '수업명(시험명)을 입력하세요.'
    }
  },
  mounted () {
    this.getYear()
    this.changeEditMode()
  },
  methods: {
    getYear () {
      const now = new Date()
      const year = now.getFullYear()
      this.classYear = year
    },
    changeEditMode () {
      if (this.mode === '수업 편집') {
        this.classTitle = this.title
        this.classSemester = this.semester
        this.placeholder = this.classTitle
      }
    },
    submitForm () {
      if (this.mode === '수업 생성') {
        this.createClass()
      } else if (this.mode === '수업 편집') {
        this.editClass()
      }
    },
    async createClass () {
      try {
        const data = {
          name: this.classTitle,
          year: this.classYear,
          semester: this.classSemester
        }
        await api.createClass(data)
        Swal.fire({
          title: `${this.classTitle} 수업이 등록되었습니다.`,
          icon: 'success',
          confirmButtonText: '확인',
          customClass: {
            actions: 'my-actions',
            confirmButton: 'order-2'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.go({ name: 'ClassList' })
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    async editClass () {
      try {
        const data = {
          name: this.classTitle,
          year: this.classYear,
          semester: this.classSemester
        }
        await api.editClass(data, this.classID)
        Swal.fire({
          title: `${this.classTitle} 수업이 수정되었습니다.`,
          icon: 'success',
          confirmButtonText: '확인',
          customClass: {
            actions: 'my-actions',
            confirmButton: 'order-2'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.go({ name: 'EditClassList' })
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
.row {
  overflow-x: auto;
}
.swal2-container{
  z-index: 9999 !important;
}
</style>
