<template>
  <div class="container">
    <header>
      <h1 id="title">수업 및 시험</h1>
      <div v-if="this.$store.getters.isAdmin" class="button-group">
        <button class="btn" @click="goEditClass">편집</button>
        <button class="btn" @click="showModal = true">
          수업 생성
        </button>
        <ModalClassList
          v-if="showModal"
          @close="showModal = false"
          mode="수업 생성"
        />
      </div>
    </header>

    <table class="table">
      <thead>
        <tr>
          <th class="col-1" scope="col">연도</th>
          <th class="col-3" scope="col">학기</th>
          <th scope="col">제목</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!this.$store.getters.isLogin"><td colspan="3">로그인 후 이용가능합니다.</td></tr>
        <tr v-else-if="noClass()"><td colspan="3">등록된 수업이 없습니다.</td></tr>
        <tr
          v-for="classes in classList"
          :key="classes"
          @click="goClassDetail(classes.id)"
        >
          <td>{{ classes.year }}</td>
          <td>{{ classes.semester }}</td>
          <td>{{ classes.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ModalClassList from '@/components/ModalClassList.vue'
import api from '@/api/index.js'

export default {
  name: 'ClassList',
  components: {
    ModalClassList
  },
  data () {
    return {
      classCount: 0,
      classList: [],
      showModal: false
    }
  },
  mounted () {
    this.getClassList()
  },
  methods: {
    async getClassList () {
      try {
        const res = await api.getClassList()
        this.classCount = res.data.length
        for (const classes of res.data) {
          if (classes.is_show) {
            this.classList.push(classes)
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    goClassDetail (classID) {
      this.$router.push({
        name: 'ClassContest',
        params: { classID: classID }
      })
    },
    goEditClass () {
      this.$router.push({
        name: 'EditClassList'
      })
    },
    noClass () {
      return (this.classCount === 0)
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

    .btn {
      width: 6rem;
      @media (max-width: 420px) {
        font-size: 14px;
      }
    }
  }

  .table {
    .col-1 {
      @media (max-width: 420px) {
        width: 50px;
      }
    }
    p {
      margin-bottom: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      @media (max-width: 420px) {
        display: block;
        width: 60%;
      }
    }
  }
}
</style>
