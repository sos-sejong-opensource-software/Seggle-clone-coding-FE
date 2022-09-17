<template>
  <div class="class-nav-bar py-4">
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <div class="navbar-toggler-icon">
            <font-awesome-icon icon="bars" />
          </div>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="nav nav-pills mb-2 mb-lg-0" role="tablist">
            <li class="nav-item">
              <a
                :class="{ 'nav-link active': tabName==='all-problems', 'nav-link':tabName!=='all-problems' }"
                id="ClassAllProblem"
                data-bs-toggle="pill"
                role="tab"
                @click="handleRoute('ClassAllProblem')"
                >전체 문제 목록</a
              >
            </li>
            <li class="nav-item">
              <a
                :class="{ 'nav-link active': tabName==='student-manage', 'nav-link':tabName!=='student-manage' }"
                id="ClassStudentManage"
                data-bs-toggle="pill"
                role="tab"
                @click="handleRoute('ClassStudentManage')"
                >수강생 및 TA 관리</a
              >
            </li>
            <li class="nav-item">
              <a
                :class="{ 'nav-link active': tabName==='class-contest', 'nav-link':tabName!=='class-contest' }"
                id="ClassProblem"
                data-bs-toggle="pill"
                role="tab"
                @click="handleRoute('ClassContest')"
                >과제 및 시험</a
              >
            </li>
          </ul>
          <!-- Pills navs -->
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'ClassNavBar',
  props: {
    className: String
  },
  data () {
    return {
      tabDefault: true,
      tabName: localStorage.getItem('ClassTab'),
      firstRender: false
    }
  },
  created () {
    localStorage.setItem('ClassTab', 'class-contest')
    this.tabName = localStorage.getItem('ClassTab')
    this.$router.push({
      name: 'ClassContest',
      params: this.$route.params.classID
    })
    console.log(this.tabName)
  },
  mounted () {},
  methods: {
    handleRoute (route) {
      this.$router.push({
        name: route,
        params: this.$route.params.classID
      })
      if (route === 'ClassAllProblem') {
        localStorage.setItem('ClassTab', 'all-problems')
      } else if (route === 'ClassStudentManage') {
        localStorage.setItem('ClassTab', 'student-manage')
      } else {
        localStorage.setItem('ClassTab', 'class-contest')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar-toggler {
  &:focus {
    box-shadow: 0 0 0 0rem;
  }
}

#navbarNav {
  justify-content: space-evenly;
  font-weight: bold;

  ul {
    @media (max-width: 992px) {
      margin-top: 20px;
      display: block;
    }
  }
  .nav-link {
    border-radius: 30px;
  }
  .active {
    background-color: #060c20;
  }
  .nav-item {
    padding: 0.5rem 1.5rem;
  }
}
</style>
