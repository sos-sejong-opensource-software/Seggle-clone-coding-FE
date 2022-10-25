<template>
  <div class="container">
    <div class="d-flex mb-2 mt-3">
      <h1 class="me-auto">전체 문제</h1>
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
    <div class="table-div">
      <table class="table">
        <thead>
          <tr>
            <th style="width: 40px" scope="col" prop="id">#</th>
            <th scope="col">제목</th>
            <th scope="col">작성일</th>
            <th scope="col">작성자</th>
            <th scope="col">옵션</th>
          </tr>
        </thead>
        <tbody>
          <!-- 내부에 들어갈 코드를 작성해주세요! -->
        </tbody>
      </table>
    </div>
    <Pagination :pagination="PageValue" @get-page="getProblemList" />
  </div>
</template>

<script>
// import api from "@/api/index.js";
import Pagination from "../../components/Pagination.vue";
import { formatTime } from "@/utils/time.js";
const Swal = require("sweetalert2");

export default {
  components: { Pagination },
  name: "AdminAllProblems",
  data() {
    return {
      keyword: "",
      count: 0,
      problemList: [],
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
      this.getProblemList(1);
    },
    getPage(page) {
      this.getProblemList(page);
    },
    /* 전체문제 리스트 불러오기 */
    async getProblemList(page) {},
    /* 문제 삭제 */
    async deleteProblem(problemID) {},
    /* 선택한 문제로 이동 */
    goProblemDetail(problemID) {},
  },
  watch: {
    keyword() {
      this.getProblemList(1);
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
a {
  color: black;
  cursor: pointer;
}
h1 {
  font-weight: bold;
  width: 60%;
  text-align: left;
  @media (max-width: 420px) {
    font-size: calc(1.2rem + 2vw);
  }
}
</style>
