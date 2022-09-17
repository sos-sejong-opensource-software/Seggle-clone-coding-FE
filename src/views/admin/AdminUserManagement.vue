<template>
  <div class="container">
    <div class="d-flex mb-2 mt-3">
      <h1 class="me-auto">사용자 관리</h1>
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
      <div>
        <div
          class="modal fade"
          id="userModal"
          tabindex="-1"
          aria-labelledby="userModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog admin-user modal-dialog-centered col-md-4">
            <div class="modal-content">
              <div class="modal-header">
                <h4>사용자 정보 수정</h4>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <h5 style="float: left" class="col-3">아이디</h5>
                  <input
                    class="col-6 text"
                    type="text"
                    :value="userName"
                    disabled
                  />
                </div>
                <div class="mb-3">
                  <h5 style="float: left" class="col-3">이름</h5>
                  <input
                    class="col-6 text"
                    type="text"
                    :value="Name"
                    disabled
                  />
                </div>
                <div class="mb-3">
                  <h5 style="float: left" class="col-3">이메일</h5>
                  <input
                    class="col-6 text"
                    type="text"
                    :value="userEmail"
                    disabled
                  />
                </div>
                <div class="mb-3">
                  <h5 style="float: left" class="col-3">권한</h5>
                  <select class="btn-toggle col-6" v-model="selected">
                    <option value="student">학생</option>
                    <option value="prof">교수</option>
                    <option value="admin">관리자</option>
                  </select>
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
                  @click="submitUser"
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
            <th style="width: 40px" scope="col" prop="id">#</th>
            <th class="col-2" scope="col">ID</th>
            <th class="col-2" scope="col">이름</th>
            <th scope="col">이메일</th>
            <th scope="col">가입날짜</th>
            <th class="col-1" scope="col">권한</th>
            <th class="col-1" scope="col">편집</th>
            <th class="col-1" scope="col">삭제</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userList" :key="user">
            <th scope="row">{{ user.id }}</th>
            <td>{{ user.username }}</td>
            <td>{{ user.name }}</td>
            <td class="email">{{ user.email }}</td>
            <td>{{ user.date_joined }}</td>
            <td>{{ user.privilege }}</td>
            <td scope="row">
              <button
                class="edit-btn"
                data-bs-toggle="modal"
                data-bs-target="#userModal"
                @click="openUser(user.username)"
              >
                <font-awesome-icon icon="pen" />
              </button>
            </td>
            <td scope="row">
              <button class="delete-btn" @click="deleteUser(user.username)">
                <font-awesome-icon icon="trash-can" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :pagination="PageValue" @get-page="getUserList" />
  </div>
</template>

<script>
import api from '@/api/index.js'
import Pagination from '@/components/Pagination.vue'
import { formatTime } from '@/utils/time.js'
const Swal = require('sweetalert2')

export default {
  name: 'AdminUser',
  components: {
    Pagination
  },
  data () {
    return {
      keyword: '',
      selected: '',
      userList: [],
      Name: '',
      userEmail: '',
      userName: '',
      currentPage: 1,
      PageValue: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getUserList(1)
    },
    /* 사용자 정보 리스트 불러오기 */
    async getUserList (page) {
      try {
        this.currentPage = page
        this.PageValue = []
        const res = await api.getUserList(page, this.keyword)
        this.PageValue.push({
          count: res.data.count,
          currentPage: this.currentPage
        })
        this.userList = res.data.results
        for (const user of this.userList) {
          user.date_joined = formatTime(user.date_joined)
          if (user.privilege === 0) {
            user.privilege = '학생'
          } else if (user.privilege === 1) {
            user.privilege = '교수'
          } else {
            user.privilege = '관리자'
          }
        }
      } catch (err) {
        console.log(err)
      }
    },
    /* 사용자 정보 열람 */
    async openUser (userName) {
      try {
        this.currentName = userName
        const res = await api.editUser(userName)
        if (res.data.privilege === 0) {
          this.selected = 'student'
        } else if (res.data.privilege === 1) {
          this.selected = 'prof'
        } else {
          this.selected = 'admin'
        }
        this.userName = res.data.username
        this.Name = res.data.name
        this.userEmail = res.data.email
      } catch (err) {
        console.log(err)
      }
    },
    /* 사용자 정보 제출 */
    async submitUser () {
      try {
        if (this.selected === 'student') {
          this.selected = 0
        } else if (this.selected === 'prof') {
          this.selected = 1
        } else {
          this.selected = 2
        }
        const data = {
          privilege: this.selected
        }
        await api.submitUser(this.currentName, data)
        this.getUserList(1)
      } catch (err) {
        console.log(err)
      }
    },
    /* 사용자 삭제 */
    async deleteUser (userName) {
      try {
        await Swal.fire({
          title: '삭제하시겠습니까?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '확인',
          cancelButtonText: '취소'
        }).then((result) => {
          if (result.isConfirmed) {
            api.deleteUser(userName)
            Swal.fire(
              {
                title: '삭제되었습니다.',
                icon: 'success',
                confirmButtonText: '확인'
              }
            ).then((result) => {
              if (result.isConfirmed) {
                api.getUserList(1, this.keyword)
                  .then(res => {
                    if (this.currentPage !== 1 && res.data.count / 15 < this.currentPage && res.data.count % 15 === 0) {
                      this.currentPage = this.currentPage - 1
                    }
                    this.getUserList(this.currentPage)
                  })
              }
            })
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  watch: {
    keyword () {
      this.getUserList(1)
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
  .text,
  .btn-toggle {
    width: 70%;
    font-size: calc(0.55rem + 1.5vw);
  }
  h5 {
    width: 30%;
    font-size: 1rem;
  }
}

.btn-toggle {
  border-width: medium;
  text-align: center;
  border: 1px solid;
  background-color: transparent;
}
.table-div {
  .table {
    min-width: 900px;
    table-layout: fixed;
    tbody {
      tr:hover {
        cursor: default;
      }
      td.email {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
h1 {
  font-weight: bold;
  width: 60%;
  text-align: left;
  @media (max-width: 420px) {
    font-size: calc(1.2rem + 2vw);
  }
}
.btn {
  @media (max-width: 767px) {
    font-size: calc(0.5rem + 2vw);
  }
}
</style>
