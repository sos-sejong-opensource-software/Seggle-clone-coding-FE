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
          <div class="modal-dialog modal-dialog-centered" data-bs-backdrop="static">
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
          <tr v-if="count === 0">
            <td colspan="7">등록된 FAQ가 없습니다.</td>
          </tr>
          <tr v-for="faq in faqList" :key="faq">
            <th scope="row">{{ faq.id }}</th>
            <td class="title">{{ faq.question }}</td>
            <td>{{ faq.created_time }}</td>
            <td>{{ faq.last_modified }}</td>
            <td>
              <div style="display: inline-block" class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckChecked"
                  v-model="faq.visible"
                  @change="changeSwitch(faq.id)"
                />
              </div>
            </td>
            <td scope="row">
              <button
                class="edit-btn"
                data-bs-toggle="modal"
                data-bs-target="#faqModal"
                @click="openFAQ(faq.id)"
              >
                <font-awesome-icon icon="pen" />
              </button>
            </td>
            <td scope="row">
              <button class="delete-btn" @click="deleteFAQ(faq.id)">
                <font-awesome-icon icon="trash-can" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from '@/api/index.js'
import { formatTime } from '@/utils/time.js'
const Swal = require('sweetalert2')

export default {
  name: 'AdminFAQ',
  data () {
    return {
      currentFaqID: '',
      createMode: true,
      faqQuestion: '',
      faqAnswer: '',
      faqVisible: true,
      faqList: [],
      count: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getFAQList()
    },
    /* FAQ 리스트 불러오기 */
    async getFAQList () {
      try {
        const res = await api.getFAQList()
        this.faqList = res.data
        this.count = this.faqList.length
        for (const faq of this.faqList) {
          faq.created_time = formatTime(faq.created_time)
          faq.last_modified = formatTime(faq.last_modified)
        }
      } catch (err) {
        console.log(err)
      }
    },
    /* FAQ 삭제 */
    async deleteFAQ (faqID) {
      try {
        await Swal.fire({
          title: '삭제하시겠습니까?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '확인',
          cancelButtonText: '취소'
        }).then((result) => {
          if (result.isConfirmed) {
            api.deleteFAQ(faqID)
            Swal.fire(
              {
                title: '삭제되었습니다.',
                icon: 'success',
                confirmButtonText: '확인'
              }
            ).then((result) => {
              if (result.isConfirmed) {
                this.getFAQList()
              }
            })
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    /* FAQ 열람 */
    async openFAQ (faqID) {
      try {
        if (typeof faqID === 'undefined') {
          this.createMode = true
          this.currentFaqID = ''
          this.faqQuestion = ''
          this.faqAnswer = ''
          this.faqVisible = true
        } else {
          this.currentFaqID = faqID
          this.createMode = false
          const res = await api.editFAQ(faqID)
          this.faqQuestion = res.data.question
          this.faqAnswer = res.data.answer
          this.faqVisible = res.data.visible
        }
      } catch (err) {
        console.log(err)
      }
    },
    /* FAQ 작성 후 제출 */
    async submitFaq () {
      try {
        const data = {
          question: this.faqQuestion,
          answer: this.faqAnswer,
          visible: this.faqVisible
        }
        /* 공지사항 수정 or 생성 */
        if (this.currentFaqID === '') {
          await api.submitFAQ(data)
        } else {
          await api.submitEditFAQ(this.currentFaqID, data)
        }
        this.getFAQList()
      } catch (err) {
        console.log(err)
      }
    },
    /* FAQ 공개 여부 설정 */
    async changeSwitch (faqID) {
      try {
        await api.changeFAQSwitch(faqID)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
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
