<template>
  <div class="container">
    <header class="announcement-detail-header">
      <button class="btn"
              @click="goAnnouncementList">
        <font-awesome-icon icon="angle-left" /> 목록
      </button>
    </header>
    <section class="grid-section">
      <span><h5>제목</h5></span>
      <span class="title">{{content.title}}</span>
      <span><h5>작성자</h5></span>
      <span>{{ content.created_user }}</span>
      <span><h5>작성일</h5></span>
      <span>{{ content.created_time }}</span>
      <span><h5>내용</h5></span>
      <span class="content"><v-md-editor :model-value="content.context" mode="preview"></v-md-editor></span>
      <!-- <span class="content"><VueShowdown class="v-show-down" :markdown="content.context"></VueShowdown></span> -->
    </section>
  </div>
</template>
<script>
import api from '@/api/index.js'
const Swal = require('sweetalert2')
// import VueShowdown from 'vue-showdown'

export default {
  name: 'AnnouncementDetail',
  // components: VueShowdown,
  data () {
    return {
      announcementID: this.$route.params.id,
      content: []
    }
  },
  created () {
    this.getContent()
  },
  beforeUpdate () {
    this.setCreatedTime()
  },
  methods: {
    async getContent () {
      try {
        const res = await api.getAnnouncementDetail(this.announcementID)
        this.content = res.data
        this.setCreatedTime()
      } catch (err) {
        if (err.response.status === 404) {
          await Swal.fire({
            title: '잘못된 접근입니다.',
            icon: 'error',
            confirmButtonText: '확인'
          }).then((result) => {
            if (result.isConfirmed) {
              this.$router.push({
                name: 'Announcement'
              })
            }
          })
        }
      }
    },
    setCreatedTime () {
      this.content.created_time = this.content.created_time.slice(0, 10)
    },
    goAnnouncementList () {
      this.$router.push({ name: 'Announcement' })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 3rem 3rem;
  @media (max-width: 420px) {
    padding: 1rem 1rem;
  }
}
header {
  padding: 2rem 0rem;
  @media (max-width: 768px) {
    display: block;
  }

  button {
    float: right;
    @media (max-width: 420px) {
      font-size: calc(0.5rem + 1.5vw);
    }
  }
}

.grid-section{
  margin-top:20px;
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 3fr;
  grid-template-rows: 1fr 1fr auto;
  text-align: left;
  @media (max-width: 420px) {
    grid-template-columns: 3fr 2fr 3fr 5fr;
  }

  h5{
    font-weight: bold;
    text-align: center;
    @media (max-width: 768px) {
      font-size:1.1rem;
    }
    @media (max-width: 420px) {
      font-size: calc(0.7rem + 1.5vw);
    }
  }

  span{
    padding: 0.7rem;
    border-bottom: 0.7px solid #E5E5E5;
    @media (max-width: 420px) {
      font-size: calc(0.55rem + 1.5vw);
      padding: 0.4rem;
    }
  }

  .title {
    grid-column: 2 / 5;
    grid-row: 1 / 2;
  }

  .content {
    grid-column: 2 / 5;
    grid-row: 3 / 4;
    padding: 1.1rem;
  }
}
</style>
