<template>
  <div class="container">
    <div class="d-flex mb-2 mt-3">
      <h1 class="me-auto">FAQ</h1>
      <div>
        <button
          class="btn"
          id="faq-create"
          data-bs-toggle="modal"
          data-bs-target="#faqModal"
          @click="openFAQ()"
        >
          + 글쓰기
        </button>
        <div
          class="modal fade"
          id="faqModal"
          tabindex="-1"
          aria-labelledby="faqModalLabel"
          aria-hidden="true"
          data-bs-backdrop="static"
        >
          <div
            class="modal-dialog modal-dialog-centered"
            data-bs-backdrop="static"
          >
            <div class="modal-content">
              <div class="modal-header">
                <h5 v-if="createMode">FAQ 생성</h5>
                <h5 v-else>FAQ 수정</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <h5 style="float: left">질문</h5>
                <textarea
                  v-model="faqQuestion"
                  id="faq-title"
                  class="form-control mb-3 p-2"
                  cols="100"
                  rows="1"
                  placeholder="질문을 입력하세요"
                ></textarea>
                <h5 style="float: left">답변</h5>
                <v-md-editor v-model="faqAnswer" height="400px"></v-md-editor>
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
                      v-model="faqVisible"
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
                  id="faq-save"
                  data-bs-dismiss="modal"
                  @click="submitFaq"
                >
                  저장
                </button>
              </div>
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
            <th class="col-1" scope="col">편집</th>
            <th class="col-1" scope="col">삭제</th>
          </tr>
        </thead>
        <tbody>
          <!-- 내부에 들어갈 코드를 작성해주세요! -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from "@/api/index.js";
import { formatTime } from "@/utils/time.js";
const Swal = require("sweetalert2");

export default {
  name: "AdminFAQ",
  data() {
    return {
      currentFaqID: "",
      createMode: true,
      faqQuestion: "",
      faqAnswer: "",
      faqVisible: true,
      faqList: [],
      count: 0,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    /* moun시 FAQ 리스트 불러오기 */
    init() {},
    /* FAQ 리스트 불러오기 */
    async getFAQList() {},
    /* FAQ 삭제 */
    async deleteFAQ(faqID) {},
    /* FAQ 열람 */
    async openFAQ(faqID) {},
    /* FAQ 작성 후 제출 */
    async submitFaq() {},
    /* FAQ 공개 여부 설정 */
    async changeSwitch(faqID) {},
  },
};
</script>

<style lang="scss" scoped>
.table-div {
  .table {
    min-width: 850px;
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
  width: 40%;
  text-align: left;
  @media (max-width: 420px) {
    font-size: calc(1.2rem + 2vw);
  }
}
.btn {
  @media (max-width: 420px) {
    font-size: calc(0.5rem + 2vw);
  }
}
</style>
