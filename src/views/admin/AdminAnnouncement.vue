<template>
  <div class="container">
    <div class="d-flex mb-2 mt-3">
      <h1 class="me-auto">공지사항</h1>
      <div>
        <form>
          <input
            class="form-control"
            type="search"
            placeholder="검색"
            aria-label="검색"
            v-model="keyword"
          />
        </form>
      </div>
    </div>
    <div>
      <div class="button">
        <button
          class="btn"
          id="announce-create"
          data-bs-toggle="modal"
          data-bs-target="#announceModal"
          @click="openAnnouncement()"
        >
          + 글쓰기
        </button>
      </div>
      <div
        class="modal fade"
        id="announceModal"
        tabindex="-1"
        aria-labelledby="announceModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div class="modal-dialog modal-dialog-centered" data-bs-backdrop="static">
          <div class="modal-content">
            <div class="modal-header">
              <h5 v-if="createMode">공지사항 생성</h5>
              <h5 v-else>공지사항 수정</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <h5 style="float: left">제목</h5>
              <textarea
                v-model="announcementTitle"
                id="announce-title"
                class="form-control mb-3 p-2"
                cols="100"
                rows="1"
                placeholder="제목을 입력하세요"
              ></textarea>
              <h5 style="float: left">내용</h5>
              <v-md-editor
                v-model="announcementContext"
                height="400px"
              ></v-md-editor>
              <div class="mt-2">
                <p style="float: left">공개여부</p>
                <span
                  class="form-check form-switch"
                  style="float: left; margin-left: 10px"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    v-model="announcementVisible"
                  />
                </span>
                <p style="float: left">중요여부</p>
                <span
                  class="form-check form-switch"
                  style="float: left; margin-left: 10px"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckChecked"
                    v-model="announcementImportant"
                  />
                </span>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                취소
              </button>
              <button
                type="button"
                class="btn btn-primary"
                id="announce-save"
                data-bs-dismiss="modal"
                @click="submitAnnouncement"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="table-div">
      <table class="table">
        <thead>
          <tr>
            <th style="width: 40px" class="col-1" scope="col" prop="id">#</th>
            <th scope="col">제목</th>
            <th scope="col">작성일</th>
            <th scope="col">마지막 수정일</th>
            <th class="col-1" scope="col">공개</th>
            <th class="col-1" scope="col">중요</th>
            <th class="col-1" scope="col">편집</th>
            <th class="col-1" scope="col">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="count === 0">
            <td colspan="8">등록된 공지사항이 없습니다.</td>
          </tr>
          <tr
            v-else
            v-for="announcement in announcementList"
            :key="announcement"
          >
            <th scope="row">{{ announcement.id }}</th>
            <td class="title">{{ announcement.title }}</td>
            <td>{{ announcement.created_time }}</td>
            <td>{{ announcement.last_modified }}</td>
            <td>
              <div style="display: inline-block" class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckChecked"
                  v-model="announcement.visible"
                  @change="
                    changeSwitch(
                      announcement.id,
                      announcement.visible,
                      announcement.important
                    )
                  "
                />
              </div>
            </td>
            <td>
              <div style="display: inline-block" class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckChecked"
                  v-model="announcement.important"
                  @change="
                    changeSwitch(
                      announcement.id,
                      announcement.visible,
                      announcement.important
                    )
                  "
                />
              </div>
            </td>
            <td scope="row">
              <button
                class="edit-btn"
                data-bs-toggle="modal"
                data-bs-target="#announceModal"
                @click="openAnnouncement(announcement.id)"
              >
                <font-awesome-icon icon="pen" />
              </button>
            </td>
            <td scope="row">
              <button
                class="delete-btn"
                @click="deleteAnnouncement(announcement.id)"
              >
                <font-awesome-icon icon="trash-can" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :pagination="PageValue" @get-page="getPage" />
  </div>
</template>

<script>
import api from '@/api/index.js'
import Pagination from '@/components/Pagination.vue'
import { formatTime } from '@/utils/time.js'
const Swal = require('sweetalert2')

export default {
  name: 'AdminAnnouncement',
  components: {
    Pagination
  },
  data () {
    return {
      currentAnnouncementID: '',
      createMode: true,
      announcementTitle: '',
      announcementContext: '',
      announcementVisible: true,
      announcementImportant: false,
      announcementList: [],
      keyword: '',
      count: 0,
      currentPage: 1,
      PageValue: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getAnnouncementList(1)
    },
    getPage (page) {
      this.getAnnouncementList(page)
    },
    /* 공지사항 리스트 불러오기 */
    async getAnnouncementList (page) {
      try {
        const res = await api.getAnnouncementList(page, this.keyword)
        this.currentPage = page
        this.PageValue = []
        this.count = res.data.count
        this.PageValue.push({
          count: res.data.count,
          currentPage: this.currentPage
        })
        this.announcementList = res.data.results.reverse()
        for (const announcement of this.announcementList) {
          announcement.created_time = formatTime(announcement.created_time)
          announcement.last_modified = formatTime(announcement.last_modified)
        }
      } catch (err) {
        console.log(err)
      }
    },
    /* 공지사항 삭제 */
    async deleteAnnouncement (announcementID) {
      try {
        await Swal.fire({
          title: '삭제하시겠습니까?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '확인',
          cancelButtonText: '취소'
        }).then((result) => {
          if (result.isConfirmed) {
            api.deleteAnnouncement(announcementID)
            Swal.fire(
              {
                title: '삭제되었습니다.',
                icon: 'success',
                confirmButtonText: '확인'
              }
            ).then((result) => {
              if (result.isConfirmed) {
                api.getAnnouncementList(1, this.keyword)
                  .then(res => {
                    if (this.currentPage !== 1 && res.data.count / 15 < this.currentPage && res.data.count % 15 === 0) {
                      this.currentPage = this.currentPage - 1
                    }
                    this.getAnnouncementList(this.currentPage)
                  })
              }
            })
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    /* 공지사항 열람 */
    async openAnnouncement (announcementID) {
      try {
        if (typeof announcementID === 'undefined') {
          this.createMode = true
          this.currentAnnouncementID = ''
          this.announcementTitle = ''
          this.announcementContext = ''
          this.announcementVisible = true
          this.announcementImportant = false
        } else {
          this.currentAnnouncementID = announcementID
          this.createMode = false
          const res = await api.editAnnouncement(announcementID)
          this.announcementTitle = res.data.title
          this.announcementContext = res.data.context
          this.announcementVisible = res.data.visible
          this.announcementImportant = res.data.important
        }
      } catch (err) {
        console.log(err)
      }
    },
    /* 공지사항 작성 후 제출 */
    async submitAnnouncement () {
      try {
        const data = {
          title: this.announcementTitle,
          context: this.announcementContext,
          important: this.announcementImportant,
          visible: this.announcementVisible
        }
        /* 공지사항 수정 or 생성 */
        if (this.currentAnnouncementID === '') {
          await api.submitAnnouncement(data)
        } else {
          await api.submitEditAnnouncement(this.currentAnnouncementID, data)
        }
        this.getAnnouncementList(this.currentPage)
      } catch (err) {
        console.log(err)
      }
    },
    /* 공지사항 공개, 중요 여부 설정 */
    async changeSwitch (announcementID, visible, important) {
      try {
        const data = {
          visible: visible,
          important: important
        }
        await api.changeAnnouncementSwitch(announcementID, data)
      } catch (err) {
        console.log(err)
      }
    }
  },
  watch: {
    keyword () {
      this.getAnnouncementList(1)
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 420px) {
  .form-control {
    float: right;
    width: 80%;
    height: 1.8rem;
    font-size: calc(0.55rem + 1.5vw);
  }
}
.table-div {
  .table {
    min-width: 950px;
    table-layout: fixed;
    tbody {
      tr:hover {
        cursor: default;
      }
      td.title {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
h1 {
  font-weight: bold;
  width: 50%;
  text-align: left;
  @media (max-width: 420px) {
    width: 30%;
    margin-left: 0px;
    font-size: calc(1.2rem + 2vw);
  }
}
.btn {
  @media (max-width: 420px) {
    font-size: calc(0.5rem + 2vw);
  }
}
.button {
  text-align: right;
}
</style>
