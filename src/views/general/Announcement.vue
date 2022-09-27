<template>
  <div class="container">

    <header class="announcement-header">
      <h1 id="title">공지사항</h1>
      <form class="search-bar">
        <input
          class="form-control"
          type="search"
          placeholder="검색"
          aria-label="검색"
          v-model="keyword"
        />
      </form>
    </header>

    <div class="table-div">
    </div>
    <Pagination :pagination="pageValue"
                @get-page="getPage"/>
  </div>
</template>
<script>
import api from '@/api/index.js'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'Announcement',
  components: {
    Pagination
  },
  data () {
    return {
      //table에서 불러와야 하는 리스트를 써주세요
      //
      //
      keyword: '',
      pageValue: [],
      currentPage: 1,
      count: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getAnnouncement(1) 
    },
    //pagination
    getPage (page) {
      this.getAnnouncement(page)
    },
    setPagination (page) {
      this.currentPage = page
      this.pageValue = []

      this.pageValue.push({
        count: this.count,
        currentPage: this.currentPage
      })

      if (this.count !== 0) {
        this.total = parseInt((this.count - 1) / 15) + 1
      }
    },
    //
    async getAnnouncement (page) {
      try {
        //공지사항 조회
        
      } catch (error) {
        console.log(error)
      }
    },
    goAnnouncementDetail (announcementID) {
      //공지사항 세부사항 페이지로 이동
    }
  },
  watch: {
    keyword () {
      this.getAnnouncement(1)
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
  display: flex;
  justify-content: space-between;
  padding: 3rem 0rem;
  @media (max-width: 768px) {
    display: block;
  }

  .form-control {
    @media (max-width: 420px) {
      float: right;
      width: 100%;
      font-size: calc(0.55rem + 1.5vw);
    }
  }
}

</style>
