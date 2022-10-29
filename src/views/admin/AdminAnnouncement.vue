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
        <div
          class="modal-dialog modal-dialog-centered"
          data-bs-backdrop="static"
        >
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
          <!-- 내부에 들어갈 코드를 작성해주세요! -->
          <tr v-for="announce in announcementList" :key="announce">
            <td>{{ announce.id }}</td>
            <td>{{ announce.title }}</td>
            <td>{{ announce.created_time }}</td>
            <td>{{ announce.last_modified }}</td>
            <td>{{ announce.visible }}</td>
            <td>{{ announce.important }}</td>
            <td>
              <button
                class="edit-btn"
                data-bs-toggle="modal"
                data-bs-target="#announceModal"
                @click="openAnnouncement(announcement.id)"
              >
                <font-awesome-icon icon="pen" />
              </button>
            </td>
            <td>
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
import api from "@/api/index.js";
import Pagination from "@/components/Pagination.vue";
import { formatTime } from "@/utils/time.js";
const Swal = require("sweetalert2");

export default {
  name: "AdminAnnouncement",
  components: {
    Pagination,
  },
  data() {
    return {
      currentAnnouncementID: "",
      createMode: true,
      announcementTitle: "",
      announcementContext: "",
      announcementVisible: true,
      announcementImportant: false,
      announcementList: [],
      keyword: "",
      count: 0,
      currentPage: 1,
      PageValue: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    /* mount 하면 1페이지 불러오기 */
    init() {
      this.getPage(1);
    },
    getPage(page) {
      this.getAnnouncementList(page);
    },
    /* 공지사항 리스트 불러오기 */
    async getAnnouncementList(page) {
      try {
        const res = await api.getAnnouncementList(page, this.keyword);
        this.announcementList = res.data.results;
        for (const announcement of this.announcementList) {
          announcement.created_time = formatTime(announcement.created_time);
          announcement.last_modified = formatTime(announcement.last_modified);
        }
      } catch (err) {
        console.log(err);
      }
    },
    /* 공지사항 삭제 */
    async deleteAnnouncement(announcementID) {
      api.deleteAnnouncement(announcementID);
      api.getAnnouncementList(announcementID, this.keyword);
    },
    /* 공지사항 열람 */
    async openAnnouncement(announcementID) {},
    /* 공지사항 작성 후 제출 */
    async submitAnnouncement() {},
    /* 공지사항 공개, 중요 여부 설정 */
    async changeSwitch(announcementID, visible, important) {},
  },
  watch: {
    keyword() {
      this.getAnnouncementList(1);
    },
  },
};
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
