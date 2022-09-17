<template>
  <div class="container">
    <notifications group="message"
                 position="top center"
                 class="noti"
                 animation-name="v-fade-left"
                 :speed="50"
                 :width="250"
                 :max="3"
                 :ignoreDuplicates="true"/>
    <div v-if="firstPage">
      <header class="d-flex mb-2 mt-3 justify-content-end">
        <h2 class="me-auto">문제 등록</h2>
        <div class="search-bar">
          <form>
            <input
              class="form-control"
              type="search"
              placeholder="검색"
              aria-label="검색"
              v-model="keyword"
            />
          </form>
          <button class="btn"
                  id="problem-create"
                  @click="selectClassProblem"
          ><font-awesome-icon icon="circle-right" />다음</button>
        </div>
      </header>
      <div class="table-div">
        <table class="table">
          <thead>
            <tr>
              <th class="col-1" scope="col"></th>
              <th scope="col">제목</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="problem in problemList" :key="problem" :class="{ 'bg-secondary bg-opacity-10': isAlreadyContestProblemExist(problem.id)}">
              <th scope="row">
                <input
                  v-if="isAlreadyContestProblemExist(problem.id)"
                  class="form-check-input"
                  type="checkbox"
                  :value="problem.id"
                  v-model="checkList"
                  disabled
                />
                <input
                  v-else
                  class="form-check-input"
                  type="checkbox"
                  :value="problem.id"
                  v-model="checkList"
                />
              </th>
              <td>{{ problem.title }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Pagination :pagination="PageValue" @get-page="getProblemList" />
    </div>
    <!---다음 버튼 누르면-->
    <div v-else>
      <header class="d-flex mb-2 mt-3 justify-content-end">
        <h3 class="me-auto">문제 순서 수정</h3>
        <div>
          <button class="btn" id="problem-create" @click="SaveContestProblem">
            저장
          </button>
        </div>
      </header>
      <div class="table-div">
        <table class="table" id="two">
          <thead>
            <div class="detail">* 드래그하여 순서를 변경할 수 있습니다</div>
          </thead>
          <tbody class="drag-tbody">
            <draggable
              class="dragArea list-group w-full"
              :list="contestProblemList"
            >
              <tr
                class="list-group-item"
                v-for="problem in contestProblemList"
                :key="problem"
              >
                <th class="id" scope="row">{{ problem.problem_id }}</th>
                <td>{{ problem.title }}</td>
              </tr>
            </draggable>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/index.js'
import Pagination from '@/components/Pagination.vue'
import { defineComponent } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

const Swal = require('sweetalert2')

export default defineComponent({
  name: 'ClassContestListEdit',
  components: {
    draggable: VueDraggableNext,
    Pagination
  },
  data () {
    return {
      classID: this.$route.params.classID,
      contestID: this.$route.params.contestID,
      problemList: [],
      alreadyList: [],
      contestProblemList: [],
      checkList: [],
      selectedProblem: [],
      changedList: [],
      keyword: '',
      total: 0,
      currentPage: 1,
      firstPage: true,
      PageValue: [],
      animation: {
        enter: {
          opacity: [1, 0],
          translateX: [0, -300],
          scale: [1, 0.2]
        },
        leave: {
          opacity: 0,
          height: 0
        }
      }
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
        this.PageValue.push({
          count: res.data.count,
          currentPage: this.currentPage
        })
        this.total = parseInt((res.data.count - 1) / 15) + 1
      } catch (err) {
        console.log(err)
      }
      try {
        const res = await api.getContestProblemList(
          this.classID,
          this.contestID
        )
        this.alreadyList = res.data
      } catch (err) {
        console.log(err)
      }
    },
    isAlreadyContestProblemExist (problemID) {
      for (const alreadyProblem of this.alreadyList) {
        if (problemID === alreadyProblem.problem_id) {
          return true
        }
      }
      return false
    },
    async selectClassProblem () {
      try {
        for (const checkedProblem of this.checkList) {
          const item = {}
          item.problem_id = checkedProblem
          this.selectedProblem.push(item)
        }
        await api.selectContestProblem(
          this.classID,
          this.contestID,
          this.selectedProblem
        )
        this.$notify({
          group: 'message',
          title: '문제가 저장되었습니다.',
          type: 'success'
        })
        this.firstPage = false
        this.getContestProblemList()
      } catch (err) {
        console.log(err)
      }
    },

    async getContestProblemList () {
      try {
        const res = await api.getContestProblemList(
          this.classID,
          this.contestID
        )
        this.contestProblemList = res.data
      } catch (err) {
        console.log(err)
      }
    },
    EditClassContestProblem (contestProblemID) {
      this.$router.push({
        name: 'EditClassContestProblem',
        params: { contestProblemID: contestProblemID }
      })
    },
    async SaveContestProblem () {
      try {
        for (let i = 0; i < this.contestProblemList.length; i++) {
          const item = {}
          item.id = this.contestProblemList[i].id
          item.order = i + 1
          this.changedList.push(item)
        }
        await api.editContestProblemOrder(
          this.classID,
          this.contestID,
          this.changedList
        )
        Swal.fire({
          title: '변경사항이 저장되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
          customClass: {
            actions: 'my-actions',
            confirmButton: 'order-2'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.firstPage = true
            this.$router.push({ name: 'ClassContestProblemList' })
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  },
  watch: {
    keyword () {
      this.getProblemList(1)
    }
  }
})
</script>

<style lang="scss" scoped>
.table-div .table {
  min-width: 0px;
}
header {
  margin-bottom: 0px;
  h2 {
    width: 30%;
    text-align: left;

    @media (max-width: 420px) {
      margin-left: 0px;
      font-size: calc(0.8rem + 2vw);
    }
  }
  h3 {
    width: 45%;
    text-align: left;

    @media (max-width: 420px) {
      margin-left: 0px;
      font-size: calc(0.8rem + 2vw);
    }
  }
  .form-control {
    float: right;
    width: 80%;
    height: 100%;
  }
  .btn {
    @media (max-width: 767px) {
      font-size: calc(0.4rem + 2vw);
    }
    float: right;
    margin-top: 0.3rem;
  }
}

a {
  color: black;
  cursor: pointer;
}

.modal-dialog {
  max-width: 80%;
}

.detail {
  font-size: 11px;
  color: gray;
}
.button {
  text-align: right;
}
.list-group-item {
  display: grid;
  grid-template-columns: 1fr 2fr;
}
.noti {
  padding-top: 100px;
}
</style>
