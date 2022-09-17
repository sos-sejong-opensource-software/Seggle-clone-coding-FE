<template>
  <div class="container">
    <div class="row">
      <ClassContestNav class="col-lg-3 col-xs-4 py-4"></ClassContestNav>
      <router-view class="col-lg-9 col-xs-8 px-4 py-4"></router-view>
    </div>
  </div>
</template>

<script>
import ClassContestNav from '@/components/ClassContestNav.vue'
export default {
  name: 'ClassContest',
  components: {
    ClassContestNav
  }
}
</script>

<style></style>
