<template>
  <div class="container">
    <header class="announcement-detail-header">
     
      <button class="button"
      @click="goAnnouncementList">목록</button>
    </header>
    <section class="grid-section">
       <!--공지사항(제목, 글 내용, 작성자) 정보 뿌리기-->
      <span><h5>제목 </h5></span>
      <span class="title">{{this.title}}</span>

      <span><h5>작성자 </h5></span>
      <span >{{this.created_user}}</span>

      <span><h5>작성일 </h5></span>
      <span>{{setCreatedTime(this.created_time)}}</span>

     <span> <h5>내용</h5></span>
     <span class="content">{{this.context}}</span>

    </section>
  </div>
</template>
<script>
import api from '@/api/index.js'
//const Swal = require('sweetalert2') //경고창 
// import VueShowdown from 'vue-showdown'

export default {
  name: 'AnnouncementDetail',
  // components: VueShowdown,
  data () {
    return {
      //
      //
      announceID:this.$route.params.id,
      title:'',
      context:'',
      created_time:'',
      created_user:''

    }
  },
  created () {
    this.getContent()
  },
  beforeUpdate () {
    this.setCreatedTime(this.created_time)
  },
  methods: {
    async getContent () {
      try {
        const res=await api. getAnnouncementDetail (this.announceID)
        this.title=res.data.title
        this.context=res.data.context
        this.created_time=res.data.created_time
        this.created_user=res.data.created_user
        console.log(res.data)
 
      } catch (err) {
        //잘못된 접근의 경우

      }
    },
    setCreatedTime (time) {
      //시간에 대한 문자열 처리
      return time.substr(0,10)
    },
    goAnnouncementList () {
      //공지사항 리스트 페이지로 가기
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
