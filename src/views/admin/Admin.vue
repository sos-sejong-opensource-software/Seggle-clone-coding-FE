<template>
  <div class="container">
    <div class="row">
      <AdminSideBar class="col-md-2 py-4 side-bar"></AdminSideBar>
      <!--밑에 페이지가 뿌려짐-->
      <router-view class="col-md-10 col-xs-10 py-4"></router-view>
    </div>
  </div>
</template>

<script>
import AdminSideBar from '@/components/AdminSideBar.vue'

export default {
  name: 'Admin',
  components: {
    AdminSideBar
  }
}
</script>

<style>
</style>
