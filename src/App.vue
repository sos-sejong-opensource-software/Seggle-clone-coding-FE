<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container px-3">
      <a class="navbar-brand" href="/">Seggle</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navBarContent"
        aria-controls="navBarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <font-awesome-icon icon="bars" />
      </button>
      <div class="collapse navbar-collapse" id="navBarContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              id="navbarDropdown"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              >문제</a
            >
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <a class="dropdown-item" href="/competition">대회</a>
              </li>
              <li>
                <a class="dropdown-item" href="/class">수업 및 시험</a>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/board">건의게시판</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/announcements">공지사항</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/faqs">FAQ</a>
          </li>
        </ul>
        <!-- 로그인 했을 때 -->
        <template v-if="isUserLogin">
          <router-link
            v-if="this.$store.getters.isSuperAdmin"
            to="/admin"
            class="admin"
          >
            {{ this.$store.state.userid }}
          </router-link>
          <router-link v-else to="/users" class="users">
            {{ this.$store.state.userid }}
          </router-link>

          <button type="button"
                  class="btn"
                  @click="logout"
          >로그아웃</button>
        </template>
        <!-- 로그인 안했을 때 -->
        <template v-else>
          <button type="button"
                  class="btn"
                  @click="goPage('Login')"
          >로그인</button>
          <button type="button"
                  class="btn"
                  @click="goPage('Register')"
          >회원가입</button>
        </template>
      </div>
    </div>
  </nav>
  <router-view />
</template>
<script>
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

export default {
  data () {
    return {
      userid: this.$store.state.userid
    }
  },
  methods: {
    async logout () {
      try {
        this.$store.dispatch('Logout')
        this.$router.push('/login')
      } catch (err) {
        console.log(err)
      }
    },
    goPage (name) {
      this.$router.push({
        name: name
      })
    }
  },
  computed: {
    isUserLogin () {
      return this.$store.getters.isLogin
    }
  }
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  width: 100%;
  min-height: 100vh;
}

#title {
  font-weight: 800;
}

nav {
  background-color: white;

  .navbar-brand {
    color: black;
  }

  .nav-link {
    color: black;

    &:focus,
    &:hover {
      color: black;
      font-weight: bold;
    }
  }
}

.users,
.admin {
  color: black;
  font-weight: bold;
  font-size: 20px;
  padding: 0px 7px;

  &:hover {
    color: black;
    text-decoration: underline;
  }
}
</style>
