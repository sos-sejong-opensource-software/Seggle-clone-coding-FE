<template>
  <div class="container">
    <div id="class-manager-form" class="form-floating row py-5" @submit.prevent="submitForm">
      <form class="class-student-form col-md-4">
        <label for="class-student" class="p-2 fs-4">수강생</label>
        <textarea id="class-student"
                  class="form-control mb-3 p-3" cols="30" rows="15"
                  v-model="studentList"
                  placeholder="수강생을 등록하세요.">
        </textarea>
        <button class="btn"
                type="submit"
                @click="submitStudentForm"
        >등록</button>
      </form>
      <form v-if="isProf()" class="class-TA-form col-md-4">
        <label for="class-TA" class="p-2 fs-4">TA</label>
        <textarea id="class-TA"
                  class="form-control mb-3 p-3" cols="30" rows="15"
                  v-model="taList"
                  placeholder="TA를 등록하세요.">
        </textarea>
        <button class="btn"
                type="submit"
                @click="submitTAForm"
        >등록</button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/api/index.js'
const Swal = require('sweetalert2')
export default {
  name: 'ClassStudentManager',
  data () {
    return {
      classID: this.$route.params.classID,
      classUserList: [],
      studentList: '',
      taList: '',
      userPrivilege: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getClassUserList()
    },
    async getClassUserList () {
      try {
        const res = await api.classUserPrivilege(this.classID)
        this.userPrivilege = res.data.privilege
        this.taList = ''
        this.studentList = ''
        if (this.userPrivilege === 2) {
          this.setTAUserList()
        }
        this.setStudentUserList()
      } catch (err) {
        console.log(err)
      }
    },
    async setStudentUserList () {
      const res = await api.getClassStudentUserList(this.classID)
      for (const StudentUser of res.data) {
        this.studentList += StudentUser.username + '\n'
      }
    },
    async setTAUserList () {
      const res = await api.getClassTAUserList(this.classID)
      for (const TAUser of res.data) {
        this.taList += TAUser.username + '\n'
      }
    },
    isProf () {
      return (this.userPrivilege > 1)
    },
    async submitTAForm () {
      const data = this.makeClassUserData(this.taList)
      const res = await api.submitClassTAList(this.classID, data)
      const msg = `존재하지 않는 아이디: ${res.data.does_not_exist}`
      const msg2 = `이미 존재하는 아이디 : ${res.data.is_existed}`
      if (res.data.success === undefined) {
        Swal.fire(
          {
            title: 'TA 등록이 완료되었습니다.',
            html: `${msg} <br> ${msg2}`,
            icon: 'success',
            confirmButtonText: '확인'
          }
        ).then((result) => {
          if (result.isConfirmed) {
            this.getClassUserList()
          }
        })
      } else {
        Swal.fire(
          {
            title: 'TA 등록이 완료되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
          }
        ).then((result) => {
          if (result.isConfirmed) {
            this.getClassUserList()
          }
        })
      }
    },
    async submitStudentForm () {
      const data = this.makeClassUserData(this.studentList)
      const res = await api.submitClassStudentList(this.classID, data)
      const msg = `존재하지 않는 아이디: ${res.data.does_not_exist}`
      const msg2 = `이미 존재하는 아이디 : ${res.data.is_existed}`
      if (res.data.success === undefined) {
        Swal.fire(
          {
            title: '수강생 등록이 완료되었습니다.',
            html: `${msg} <br> ${msg2}`,
            icon: 'success',
            confirmButtonText: '확인'
          }
        ).then((result) => {
          if (result.isConfirmed) {
            this.getClassUserList()
          }
        })
      } else {
        Swal.fire(
          {
            title: '수강생 등록이 완료되었습니다.',
            icon: 'success',
            confirmButtonText: '확인'
          }
        ).then((result) => {
          if (result.isConfirmed) {
            this.getClassUserList()
          }
        })
      }
      // this.getClassUserList()
    },
    makeClassUserData (userList) {
      const data = []
      const tmp = userList.split('\n')
      for (const user of tmp) {
        if (user !== '') {
          data.push({ username: user })
        }
      }
      return data
    }
  }
}
</script>

<style scoped>
#class-manager-form {
  justify-content: space-evenly;
}

label {
  font-weight: bold;
}

.btn {
  float: right;
}
</style>
