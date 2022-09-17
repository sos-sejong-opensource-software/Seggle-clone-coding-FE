<template>
  <div class="contest-nav-bar">
    <nav class="nav flex-column px-4 py-4">
      <div class="nav-header px-1 py-2">
        <span id="title">목록</span>
        <span
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          v-if="this.$store.getters.isAdmin"
          >+</span
        >
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <li>
            <a
              class="dropdown-item"
              v-if="this.$store.getters.isAdmin"
              @click="showModal = true"
              >과제 및 시험 목록 생성</a
            >
          </li>
          <li>
            <a
              class="dropdown-item"
              v-if="this.$store.getters.isAdmin"
              @click="problemModal = true"
              >과제 및 시험 목록 편집</a
            >
          </li>
        </ul>
        <ModalContestCreate
          v-if="showModal"
          @close="showModal = false"
          :mode="'create'"
        />
      </div>
      <ul class="navbar-nav px-3">
        <li class="nav-item" v-for="contest in contestList" :key="contest">
          <a
            v-if="contest.visible"
            class="nav-link"
            @click="goContest(contest.id)"
            data-bs-toggle="pill"
          >
            {{ contest.name }}</a
          >
        </li>
      </ul>
    </nav>
    <ModalContestListEdit v-if="problemModal" @close="problemModal = false" />
  </div>
</template>

<script>
import ModalContestListEdit from '@/components/ModalContestListEdit.vue'
import ModalContestCreate from '@/components/ModalContestCreate.vue'
import api from '@/api/index.js'

export default {
  name: 'ClassContestNav',
  components: {
    ModalContestListEdit,
    ModalContestCreate
  },
  data () {
    return {
      classID: this.$route.params.classID,
      contestList: [],
      showModal: false,
      problemModal: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getContestList()
    },
    async getContestList () {
      try {
        const res = await api.getContestList(this.classID)
        this.contestList = res.data
      } catch (error) {
        console.log(error)
      }
    },
    goContest (contestID) {
      this.contestID = contestID
      this.$router.push({
        name: 'ClassContestProblemList',
        params: { contestID: contestID }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.contest-nav-bar {
  width: 12rem;
  flex-direction: column;
  align-items: center;

  @media (max-width: 992px) {
    width: 100%;
  }
}
nav {
  float: left;
  border-radius: 14px;
  margin-bottom: 10px;
  width: 12rem;

  background-color: #fff;
  border: 0.025rem solid #d7e2eb;
  margin-top: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 8%);
  &:hover {
    box-shadow: 0px 12px 30px 6px rgb(0 0 0 / 16%);
  }
  padding: 2rem 1rem;

  @media (max-width: 992px) {
    width: 100%;
  }

  .nav-header {
    width: 100%;
    #title {
      float: left;
      font-size: 18px;
    }
    #dropdownMenuButton {
      float: right;
      cursor: pointer;
      font-weight: bold;
      width: 24px;
      height: 24px;
      background-color: #0e1b49;
      border-radius: 24px;
      color: white;
    }
    .dropdown-menu {
      border: 0.025rem solid #d7e2eb;
    }
    .dropdown-item {
      &:hover {
        background: none;
        font-weight: bold;
      }
    }
    .icon {
      float: right;
      color: black;
    }
  }
  .navbar-nav {
    width: 100%;
  }
  .nav-link {
    display: block;
    width: 6rem;
    overflow: hidden; // 100px 넘으면 hidden
    text-overflow: ellipsis; // 100px 넘으면 생략 부호
    white-space: nowrap;

    @media (max-width: 992px) {
      width: 100%;
    }
  }
}
</style>
