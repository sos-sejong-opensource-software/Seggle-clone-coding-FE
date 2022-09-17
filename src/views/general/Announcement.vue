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
      <table class="table">
        <thead>
          <tr>
            <th class="col-lg-1 col-md-2 tableId" scope="col">#</th>
            <th class="title-col" scope="col">제목</th>
            <th class="col-lg-2" scope="col">작성일</th>
            <th class="col-lg-1 col-md-2" scope="col">작성자</th>
          </tr>
        </thead>
        <tbody>
       <tr v-if="count===0">
         <td></td>
         <td>등록된 공지사항이 없습니다.</td>
         <td></td>
         <td></td>
       </tr>

          <tr
            v-for="announcement in announcementImportantList"
            :key="announcement"
            @click="goAnnouncementDetail(announcement.id)"
            class="important-row"
          >
            <th class="tableId" scope="row">중요</th>
            <td class="title-col">{{ announcement.title }}</td>
            <td>{{ setCreatedTime(announcement.created_time) }}</td>
            <td>관리자</td>
          </tr>

          <tr
            v-for="announcement in announcementList"
            :key="announcement"
            @click="goAnnouncementDetail(announcement.id)"
          >
            <td class="tableId" scope="row">{{ announcement.id }}</td>
            <td class="title-col">{{ announcement.title }}</td>
            <td>{{ setCreatedTime(announcement.created_time) }}</td>
            <td>관리자</td>
          </tr>
        </tbody>
      </table>
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
      announcementList: [],
      announcementImportantList: [],
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
    getPage (page) {
      this.getAnnouncement(page)
    },
    setCreatedTime (time) {
      return time.slice(0, 10)
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
    async getAnnouncement (page) {
      try {
        this.announcementList = []
        this.announcementImportantList = []

        const res = await api.getAnnouncement(page, this.keyword)

        const announcementList = res.data.results
        for (const announcement of announcementList) {
          if (announcement.important) {
            this.announcementImportantList.push(announcement)
          } else {
            this.announcementList.push(announcement)
          }
        }
        this.announcementList.reverse()

        this.count = res.data.count
        this.setPagination(page)
      } catch (error) {
        console.log(error)
      }
    },
    goAnnouncementDetail (announcementID) {
      this.$router.push({
        name: 'AnnouncementDetail',
        params: { id: announcementID }
      })
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

.table-div {
  .table {
    min-width: 0px;
    white-space: normal;
    table-layout: fixed;

    tr {
      @media (max-width: 420px) {
        font-size: calc(0.55rem + 2vw);
        padding: 0px;
      }
    }

    .important-row {
      background-color: #ddd;
      font-weight: bold;
    }

    .title-col {
      text-align: left;
    }

    th:first-child {
      @media (max-width: 767px) {
        width: 50px;
      }
    }

    td:nth-child(2) {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    th:nth-child(3),
    td:nth-child(3) {
      @media (max-width: 991px){
        width: 150px;
      }
      @media (max-width: 420px) {
        display: none;
      }
    }

    th:nth-child(4),
    td:nth-child(4) {
      @media (max-width: 991px) {
        display: none;
      }
    }
  }
}
</style>
