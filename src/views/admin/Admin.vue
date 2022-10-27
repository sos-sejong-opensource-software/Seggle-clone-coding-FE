<template>
  <div class="container">
    <div class="row">
      <!-- 내부에 들어갈 코드를 작성해주세요! -->
      <AdminSideBar/>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import AdminSideBar from "@/components/AdminSideBar.vue";

export default {
  name: "Admin",
  components: {
    /* AdminSideBar을 직접 구현해주세요! */
    AdminSideBar,
  },
};
</script>

<style></style>
