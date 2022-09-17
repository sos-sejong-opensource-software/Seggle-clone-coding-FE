<template>
  <div class="container">
    <h1 id="title">{{ this.classTitle }}</h1>
    <ClassNavBar v-if="IsClassAdmin()" :className="classTitle"/>
    <router-view></router-view>
  </div>
</template>

<script>
import api from '@/api/index.js'
import ClassNavBar from '@/components/ClassNavBar.vue'
const Swal = require('sweetalert2')

export default {
  name: 'Class',
  components: {
    ClassNavBar
  },
  data () {
    return {
      classID: this.$route.params.classID,
      classTitle: '',
      userPrivilege: 0
    }
  },
  mounted () {
    this.getClassInfo()
    this.getUserPrevilege()
  },
  methods: {
    async getClassInfo () {
      try {
        const res = await api.getClass(this.classID)
        this.classTitle = res.data.name
      } catch (err) {
        if (err.response.status === 404) {
          await Swal.fire({
            title: '잘못된 접근입니다.',
            icon: 'error',
            confirmButtonText: '확인'
          }).then((result) => {
            if (result.isConfirmed) {
              this.$router.push({
                name: 'ClassList'
              })
            }
          })
        }
      }
    },
    async getUserPrevilege () {
      try {
        const res = await api.classUserPrivilege(this.classID)
        this.userPrivilege = res.data.privilege
      } catch (err) {
        if (err.response.status === 404) {
          console.log(err.response.status)
          await Swal.fire({
            title: '잘못된 접근입니다.',
            icon: 'error',
            confirmButtonText: '확인'
          }).then((result) => {
            if (result.isConfirmed) {
              this.$router.push({
                name: 'ClassList'
              })
            }
          })
        }
        console.log(err)
      }
    },
    IsClassAdmin () {
      try {
        return (this.userPrivilege > 0)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  padding: 0px 0rem;
  margin-bottom: 0rem;
  margin-top: 4rem;
  text-align: center;

  @media (max-width: 992px) {
    width: 100%;
    padding: 0rem;
    margin-top: 1rem;
  }
}
</style>
