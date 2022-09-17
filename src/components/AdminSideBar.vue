<template>
<div class="admin-sidebar">
  <nav class="nav justify-content-center">
    <ul class="navbar-nav">
        <li class="nav-item">
            <router-link class="nav-link" to="/admin/all-problems">전체 문제</router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link" to="/admin/all-classes">전체 수업</router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link" to="/admin/announcements">공지사항</router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link" to="/admin/faqs">FAQ</router-link>
        </li>
        <li class="nav-item">
            <router-link class="nav-link" to="/admin/user-management">사용자 관리</router-link>
        </li>
    </ul>
  </nav>
</div>
</template>

<script>
export default {
  name: 'AdminSideBar'
}
</script>

<style lang="scss" scoped>
nav {
  float: left;
  width:100%;
  border-radius: 1.5rem;
}

a {
  color: #000000;
  @media (max-width: 420px) {
    font-size: calc(0.55rem + 2vw);
  }
}

ul {
  width: 100%;
}

nav {
  .nav-link {
    color: black;
    &:hover {
      color: black;
      font-weight: bold;
    }
  }
  .router-link-active {
    background-color: #060c20;
    border-radius: 30px;
    color: white;
    font-weight: bold;
    &:hover {
      color: white;
      font-weight:bold;
    }
  }
}
</style>
