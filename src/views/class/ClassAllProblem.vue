<template>
  <div class="container">
    <div class="search-box mb-2 mt-3 justify-content-end">
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
        <button class="btn" @click="createProblem()">+ 문제 생성</button>
      </div>
    </div>
    <div class="table-div">
    <table class="table">
    <thead>
      <tr>
        <th scope="col" prop="id">#</th>
        <th scope="col">제목</th>
        <th scope="col">작성일</th>
        <th scope="col">작성자</th>
        <th scope="col">공개</th>
        <th scope="col">편집</th>
        <th scope="col">삭제</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="count === 0">
          <td colspan="7">등록된 문제가 없습니다.</td>
      </tr>
      <tr v-for="problem in problemList" :key="problem">
        <th @click="goProblemDetail(problem.id)" scope="row">{{ problem.id }}</th>
        <td @click="goProblemDetail(problem.id)">
          <a>{{ problem.title }}</a>
        </td>
        <td @click="goProblemDetail(problem.id)">{{ problem.created_time }}</td>
        <td @click="goProblemDetail(problem.id)">{{ problem.created_user }}</td>
        <td>
          <div style="display: inline-block" class="form-check form-switch">
            <input class="form-check-input"
                   type="checkbox"
                   id="flexSwitchCheckChecked"
                   v-model="problem.public"
                   @change="changeSwitch(problem.id)">
          </div>
        </td>
        <td scope="row">
          <button class="edit-btn"
                  @click="editProblem(problem.id)">
            <font-awesome-icon icon="pen" />
          </button>
        </td>
        <td scope="row">
          <button class="delete-btn"
                  @click="deleteProblem(problem.id)">
            <font-awesome-icon icon="trash-can" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  </div>
  <Pagination :pagination="PageValue" @get-page="getProblemList"/>
</div>
</template>

<script>
import api from '@/api/index.js'
import Pagination from '@/components/Pagination.vue'
import { formatTime } from '@/utils/time.js'
const Swal = require('sweetalert2')

export default {
  name: 'ClassAllProblems',
  components: {
    Pagination
  },
  data () {
    return {
      problemList: [],
      keyword: '',
      currentPage: 1,
      PageValue: [],
      count: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getProblemList(1)
    },
    async getProblemList (page) {
      try {
        this.currentPage = page
        this.PageValue = []
        const res = await api.getProblemList(page, this.keyword)
        this.problemList = res.data.results
        this.count = this.problemList.length
        for (const problem of this.problemList) {
          problem.created_time = formatTime(problem.created_time)
        }
        this.PageValue.push({ count: res.data.count, currentPage: this.currentPage })
      } catch (err) {
        console.log(err)
      }
    },
    async deleteProblem (problemID) {
      try {
        await Swal.fire({
          title: '삭제하시겠습니까?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: '확인',
          cancelButtonText: '취소'
        }).then((result) => {
          if (result.isConfirmed) {
            api.deleteProblem(problemID)
            Swal.fire(
              {
                title: '삭제되었습니다.',
                icon: 'success',
                confirmButtonText: '확인'
              }
            ).then((result) => {
              if (result.isConfirmed) {
                api.getProblemList(1, this.keyword)
                  .then(res => {
                    if (this.currentPage !== 1 && res.data.count / 15 < this.currentPage && res.data.count % 15 === 0) {
                      this.currentPage = this.currentPage - 1
                    }
                    this.getProblemList(this.currentPage)
                  })
              }
            })
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    goProblemDetail (problemID) {
      this.$router.push({
        name: 'ClassProblem',
        params: {
          problemID: problemID
        }
      })
    },
    editProblem (problemID) {
      this.$router.push({
        name: 'EditClassProblem',
        params: {
          classID: this.$route.params.classID,
          problemID: problemID
        }
      })
    },
    createProblem () {
      this.$router.push({
        name: 'CreateClassProblem',
        params: {
          classID: this.$route.params.classID
        }
      })
    },
    async changeSwitch (problemID) {
      try {
        await api.changeProblemSwitch(problemID)
        this.getProblemList(this.currentPage)
      } catch (err) {
        console.log(err)
      }
    }
  },
  watch: {
    'keyword' () {
      this.getProblemList(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  @media (max-width: 420px) {
    display: block;
  }

  .form-control {
    @media (max-width: 420px) {
      font-size: 14px;
    }
  }
}

.btn {
  @media (max-width: 420px) {
    margin-top: 5px;
    font-size: 14px;
  }
}

</style>
